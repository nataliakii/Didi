import {
  buildVivaCheckoutUrl,
  getVivaAccountsBaseUrl,
  getVivaApiBaseUrl,
  getVivaLegacyApiBaseUrl,
  getVivaSourceCode,
  isVivaConfigured,
  toVivaAmountCents,
  toVivaRequestLang,
} from "@/constants/viva";

const OAUTH_SCOPE = "urn:viva:payments:core:api:redirectcheckout";

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

export interface CreateVivaPaymentOrderInput {
  amountMajor: number;
  orderNumber: string;
  customer: {
    email: string;
    fullName: string;
    phone?: string;
    countryCode?: string;
  };
  locale?: string;
  description?: string;
}

export interface CreateVivaPaymentOrderResult {
  orderCode: string;
  checkoutUrl: string;
}

export interface VivaTransaction {
  transactionId: string;
  orderCode: string;
  statusId: string;
  amountCents: number;
  currencyCode?: string;
  email?: string;
  fullName?: string;
}

function requireConfigured() {
  if (!isVivaConfigured()) {
    throw new Error(
      "Viva.com is not configured. Set VIVA_CLIENT_ID, VIVA_CLIENT_SECRET, and VIVA_SOURCE_CODE.",
    );
  }
}

async function getAccessToken(): Promise<string> {
  requireConfigured();

  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 30_000) {
    return tokenCache.accessToken;
  }

  const clientId = process.env.VIVA_CLIENT_ID!.trim();
  const clientSecret = process.env.VIVA_CLIENT_SECRET!.trim();
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${getVivaAccountsBaseUrl()}/connect/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: OAUTH_SCOPE,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Viva OAuth failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };

  return data.access_token;
}

export async function createVivaPaymentOrder(
  input: CreateVivaPaymentOrderInput,
): Promise<CreateVivaPaymentOrderResult> {
  const accessToken = await getAccessToken();
  const amount = toVivaAmountCents(input.amountMajor);

  if (amount < 30) {
    throw new Error("Payment amount is below the Viva.com minimum.");
  }

  const payload = {
    amount,
    sourceCode: getVivaSourceCode(),
    customerTrns: input.description ?? `Order ${input.orderNumber}`,
    merchantTrns: input.orderNumber,
    tags: [input.orderNumber],
    customer: {
      email: input.customer.email,
      fullName: input.customer.fullName,
      phone: input.customer.phone,
      countryCode: input.customer.countryCode,
      requestLang: toVivaRequestLang(input.locale ?? "en"),
    },
  };

  const response = await fetch(`${getVivaApiBaseUrl()}/checkout/v2/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Viva create order failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as { orderCode: number | string };
  const orderCode = String(data.orderCode);

  return {
    orderCode,
    checkoutUrl: buildVivaCheckoutUrl(orderCode),
  };
}

function pickString(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }
  return undefined;
}

function pickNumber(obj: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return undefined;
}

/**
 * Retrieve Transaction (Checkout v2). Amount is in minor units (cents).
 * Docs: GET /checkout/v2/transactions/{transactionId}
 */
export async function retrieveVivaTransaction(
  transactionId: string,
): Promise<VivaTransaction> {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${getVivaApiBaseUrl()}/checkout/v2/transactions/${encodeURIComponent(transactionId)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Viva retrieve transaction failed (${response.status}): ${body}`,
    );
  }

  const data = (await response.json()) as Record<string, unknown>;
  const orderCode = pickString(data, ["orderCode", "OrderCode"]);
  const statusId = pickString(data, ["statusId", "StatusId"]);
  const amountCents = pickNumber(data, ["amount", "Amount"]);

  if (!orderCode || !statusId || amountCents === undefined) {
    throw new Error("Viva retrieve transaction response missing required fields.");
  }

  return {
    transactionId:
      pickString(data, ["transactionId", "TransactionId"]) ?? transactionId,
    orderCode,
    statusId,
    amountCents,
    currencyCode: pickString(data, ["currencyCode", "CurrencyCode"]),
    email: pickString(data, ["email", "Email"]),
    fullName: pickString(data, ["fullName", "FullName"]),
  };
}

/**
 * Webhook verification key for Viva's GET handshake.
 * Uses Merchant ID + API Key (Basic auth) against the legacy messages API.
 */
export async function getVivaWebhookVerificationKey(): Promise<{ Key: string }> {
  const merchantId = process.env.VIVA_MERCHANT_ID?.trim();
  const apiKey = process.env.VIVA_API_KEY?.trim();

  if (!merchantId || !apiKey) {
    throw new Error(
      "VIVA_MERCHANT_ID and VIVA_API_KEY are required for webhook verification.",
    );
  }

  const basic = Buffer.from(`${merchantId}:${apiKey}`).toString("base64");
  const urls = [
    `${getVivaApiBaseUrl()}/api/messages/config/token`,
    `${getVivaLegacyApiBaseUrl()}/api/messages/config/token`,
  ];

  let lastError: Error | null = null;

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Basic ${basic}` },
        cache: "no-store",
      });

      if (!response.ok) {
        lastError = new Error(
          `Viva webhook key failed (${response.status}) at ${url}`,
        );
        continue;
      }

      const data = (await response.json()) as { Key?: string; key?: string };
      const key = data.Key ?? data.key;
      if (!key) {
        lastError = new Error("Viva webhook key response missing Key.");
        continue;
      }
      return { Key: key };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError ?? new Error("Could not retrieve Viva webhook verification key.");
}

export function isSuccessfulVivaStatus(statusId: string): boolean {
  return statusId === "F" || statusId === "C";
}
