import {
  getDhlAccountNumber,
  getDhlApiBaseUrl,
  getDhlDefaultHsCode,
  getDhlDefaultPackage,
  getDhlOrigin,
  getDhlShipperContact,
  isDhlConfigured,
  shouldRequestDhlPickup,
} from "@/constants/dhl";

export interface DhlRateQuoteInput {
  destinationCountryCode: string;
  destinationCityName: string;
  destinationPostalCode: string;
  /** Declared goods value in major currency units (for insurance/customs context). */
  declaredValue?: number;
  currencyCode?: string;
  /** Extra weight beyond the default jewellery parcel (kg). */
  extraWeightKg?: number;
}

export interface DhlShippingRate {
  productCode: string;
  localProductCode?: string;
  productName: string;
  price: number;
  currency: string;
  estimatedDelivery?: string;
  deliveryCapabilities?: {
    totalTransitDays?: number;
  };
}

interface DhlTotalPrice {
  currencyType?: string;
  priceCurrency?: string;
  price?: number;
}

interface DhlProduct {
  productName?: string;
  productCode?: string;
  localProductCode?: string;
  totalPrice?: DhlTotalPrice[];
  deliveryCapabilities?: {
    estimatedDeliveryDateAndTime?: string;
    totalTransitDays?: number;
  };
}

interface DhlRatesResponse {
  products?: DhlProduct[];
  detail?: string;
  message?: string;
  title?: string;
}

function requireConfigured() {
  if (!isDhlConfigured()) {
    throw new Error(
      "DHL Express is not configured. Set DHL_API_KEY, DHL_API_SECRET, and DHL_ACCOUNT_NUMBER.",
    );
  }
}

function authHeader(): string {
  const key = process.env.DHL_API_KEY!.trim();
  const secret = process.env.DHL_API_SECRET!.trim();
  return `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`;
}

/** Next calendar weekday (Mon–Fri) in YYYY-MM-DD for plannedShippingDate. */
export function nextBusinessShippingDate(from = new Date()): string {
  const date = new Date(from);
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + 1);
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }
  return date.toISOString().slice(0, 10);
}

function pickPrice(
  prices: DhlTotalPrice[] | undefined,
  preferredCurrency: string,
): { price: number; currency: string } | null {
  if (!prices?.length) return null;

  const preferred = preferredCurrency.toUpperCase();
  const byCurrency =
    prices.find(
      (p) =>
        p.currencyType === "BILLC" &&
        p.priceCurrency?.toUpperCase() === preferred &&
        typeof p.price === "number",
    ) ??
    prices.find(
      (p) => p.currencyType === "BILLC" && typeof p.price === "number",
    ) ??
    prices.find((p) => typeof p.price === "number");

  if (!byCurrency || typeof byCurrency.price !== "number") return null;

  return {
    price: byCurrency.price,
    currency: (byCurrency.priceCurrency || preferred).toUpperCase(),
  };
}

/**
 * MyDHL Rating — GET /rates for a one-piece jewellery parcel.
 * Docs: https://developer.dhl.com/api-reference/dhl-express-mydhl-api
 */
export async function fetchDhlExpressRates(
  input: DhlRateQuoteInput,
): Promise<DhlShippingRate[]> {
  requireConfigured();

  const origin = getDhlOrigin();
  const pkg = getDhlDefaultPackage();
  const weight = Math.max(
    0.1,
    pkg.weightKg + Math.max(0, input.extraWeightKg ?? 0),
  );
  const destCountry = input.destinationCountryCode.trim().toUpperCase();
  const isCustomsDeclarable = destCountry !== origin.countryCode;
  const preferredCurrency = (input.currencyCode || "EUR").toUpperCase();

  const params = new URLSearchParams({
    accountNumber: getDhlAccountNumber(),
    originCountryCode: origin.countryCode,
    originCityName: origin.cityName,
    originPostalCode: origin.postalCode,
    destinationCountryCode: destCountry,
    destinationCityName: input.destinationCityName.trim(),
    destinationPostalCode: input.destinationPostalCode.trim(),
    weight: String(weight),
    length: String(pkg.lengthCm),
    width: String(pkg.widthCm),
    height: String(pkg.heightCm),
    plannedShippingDate: nextBusinessShippingDate(),
    isCustomsDeclarable: String(isCustomsDeclarable),
    unitOfMeasurement: "metric",
    nextBusinessDay: "true",
    strictValidation: "false",
    requestEstimatedDeliveryDate: "true",
    estimatedDeliveryDateType: "QDDF",
  });

  const url = `${getDhlApiBaseUrl()}/rates?${params.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: authHeader(),
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const body = (await response.json().catch(() => ({}))) as DhlRatesResponse;

  if (!response.ok) {
    const detail =
      body.detail || body.message || body.title || `HTTP ${response.status}`;
    throw new Error(`DHL rates request failed: ${detail}`);
  }

  const products = body.products ?? [];
  const rates: DhlShippingRate[] = [];

  for (const product of products) {
    if (!product.productCode) continue;
    const priced = pickPrice(product.totalPrice, preferredCurrency);
    if (!priced) continue;

    rates.push({
      productCode: product.productCode,
      localProductCode: product.localProductCode,
      productName: product.productName || `DHL ${product.productCode}`,
      price: priced.price,
      currency: priced.currency,
      estimatedDelivery:
        product.deliveryCapabilities?.estimatedDeliveryDateAndTime,
      deliveryCapabilities: {
        totalTransitDays: product.deliveryCapabilities?.totalTransitDays,
      },
    });
  }

  rates.sort((a, b) => a.price - b.price);
  return rates;
}

/** Next weekday at 13:00 GMT — MyDHL plannedShippingDateAndTime format. */
export function nextBusinessShippingDateTime(from = new Date()): string {
  const date = new Date(from);
  date.setUTCDate(date.getUTCDate() + 1);
  while (date.getUTCDay() === 0 || date.getUTCDay() === 6) {
    date.setUTCDate(date.getUTCDate() + 1);
  }
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T13:00:00 GMT+00:00`;
}

export interface DhlShipmentParty {
  name: string;
  phone: string;
  email?: string;
  companyName?: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  countryCode: string;
  state?: string;
}

export interface DhlShipmentLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateDhlShipmentInput {
  productCode: string;
  localProductCode?: string;
  orderNumber: string;
  receiver: DhlShipmentParty;
  lineItems: DhlShipmentLineItem[];
  declaredValue: number;
  currencyCode: string;
  extraWeightKg?: number;
}

export interface DhlShipmentDocument {
  typeCode: string;
  imageFormat: string;
  contentBase64: string;
}

export interface CreateDhlShipmentResult {
  trackingNumber: string;
  trackingUrl?: string;
  documents: DhlShipmentDocument[];
  dispatchConfirmationNumber?: string;
}

interface DhlShipmentApiResponse {
  shipmentTrackingNumber?: string;
  trackingUrl?: string;
  documents?: Array<{
    typeCode?: string;
    imageFormat?: string;
    content?: string;
  }>;
  dispatchConfirmationNumber?: string;
  detail?: string;
  message?: string;
  title?: string;
}

/**
 * MyDHL Shipment — POST /shipments
 * Creates AWB + label (and commercial invoice when customs-declarable).
 */
export async function createDhlExpressShipment(
  input: CreateDhlShipmentInput,
): Promise<CreateDhlShipmentResult> {
  requireConfigured();

  const origin = getDhlOrigin();
  const shipper = getDhlShipperContact();
  const pkg = getDhlDefaultPackage();
  const weight = Math.max(
    0.1,
    pkg.weightKg + Math.max(0, input.extraWeightKg ?? 0),
  );
  const destCountry = input.receiver.countryCode.trim().toUpperCase();
  const isCustomsDeclarable = destCountry !== origin.countryCode;
  const currency = input.currencyCode.trim().toUpperCase();
  const hsCode = getDhlDefaultHsCode();
  const invoiceDate = new Date().toISOString().slice(0, 10);

  const lineItems = input.lineItems.map((item, index) => {
    const qty = Math.max(1, item.quantity);
    const share = weight / Math.max(1, input.lineItems.length);
    return {
      number: index + 1,
      description: item.description.slice(0, 70),
      price: Math.round(item.unitPrice * 100) / 100,
      quantity: {
        value: qty,
        unitOfMeasurement: "PCS",
      },
      commodityCodes: [
        {
          typeCode: "outbound",
          value: hsCode,
        },
      ],
      exportReasonType: "permanent",
      manufacturerCountry: origin.countryCode,
      weight: {
        netValue: Math.round((share * 0.85) * 1000) / 1000,
        grossValue: Math.round(share * 1000) / 1000,
      },
    };
  });

  const body = {
    plannedShippingDateAndTime: nextBusinessShippingDateTime(),
    pickup: {
      isRequested: shouldRequestDhlPickup(),
    },
    productCode: input.productCode,
    ...(input.localProductCode
      ? { localProductCode: input.localProductCode }
      : {}),
    getRateEstimates: false,
    accounts: [
      {
        typeCode: "shipper",
        number: getDhlAccountNumber(),
      },
    ],
    outputImageProperties: {
      printerDPI: 300,
      encodingFormat: "pdf",
      imageOptions: [
        {
          typeCode: "label",
          templateName: "ECOM26_84_001",
          renderDHLLogo: true,
          fitLabelsToA4: false,
        },
        ...(isCustomsDeclarable
          ? [
              {
                typeCode: "invoice",
                templateName: "COMMERCIAL_INVOICE_P_10",
                isRequested: true,
                invoiceType: "commercial",
                languageCode: "eng",
              },
            ]
          : []),
      ],
    },
    customerDetails: {
      shipperDetails: {
        postalAddress: {
          postalCode: origin.postalCode,
          cityName: origin.cityName,
          countryCode: origin.countryCode,
          addressLine1: origin.addressLine1,
          ...(origin.addressLine2
            ? { addressLine2: origin.addressLine2 }
            : {}),
        },
        contactInformation: {
          email: shipper.email,
          phone: shipper.phone,
          companyName: shipper.companyName,
          fullName: shipper.fullName,
        },
        typeCode: "business",
      },
      receiverDetails: {
        postalAddress: {
          postalCode: input.receiver.postalCode,
          cityName: input.receiver.city,
          countryCode: destCountry,
          addressLine1: input.receiver.line1,
          ...(input.receiver.line2
            ? { addressLine2: input.receiver.line2 }
            : {}),
          ...(input.receiver.state
            ? { provinceCode: input.receiver.state.slice(0, 35) }
            : {}),
        },
        contactInformation: {
          ...(input.receiver.email ? { email: input.receiver.email } : {}),
          phone: input.receiver.phone,
          companyName: input.receiver.companyName || input.receiver.name,
          fullName: input.receiver.name,
        },
        typeCode: "private",
      },
    },
    content: {
      packages: [
        {
          weight,
          dimensions: {
            length: pkg.lengthCm,
            width: pkg.widthCm,
            height: pkg.heightCm,
          },
          customerReferences: [
            {
              value: input.orderNumber.slice(0, 35),
              typeCode: "CU",
            },
          ],
          description: "Fine jewellery",
          labelDescription: input.orderNumber.slice(0, 30),
        },
      ],
      isCustomsDeclarable,
      description: "Fine jewellery / diamond pieces",
      incoterm: "DAP",
      unitOfMeasurement: "metric",
      ...(isCustomsDeclarable
        ? {
            declaredValue: Math.round(input.declaredValue * 100) / 100,
            declaredValueCurrency: currency,
            exportDeclaration: {
              lineItems,
              invoice: {
                number: input.orderNumber.slice(0, 35),
                date: invoiceDate,
              },
            },
          }
        : {}),
    },
    customerReferences: [
      {
        value: input.orderNumber.slice(0, 35),
        typeCode: "CU",
      },
    ],
  };

  const url = `${getDhlApiBaseUrl()}/shipments`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => ({}))) as DhlShipmentApiResponse;

  if (!response.ok) {
    const detail =
      payload.detail ||
      payload.message ||
      payload.title ||
      `HTTP ${response.status}`;
    throw new Error(`DHL shipment creation failed: ${detail}`);
  }

  const trackingNumber = payload.shipmentTrackingNumber?.trim();
  if (!trackingNumber) {
    throw new Error("DHL shipment response missing tracking number.");
  }

  const documents: DhlShipmentDocument[] = (payload.documents ?? [])
    .filter((doc) => doc.content && doc.typeCode)
    .map((doc) => ({
      typeCode: doc.typeCode!,
      imageFormat: (doc.imageFormat || "PDF").toUpperCase(),
      contentBase64: doc.content!,
    }));

  return {
    trackingNumber,
    trackingUrl: payload.trackingUrl,
    documents,
    dispatchConfirmationNumber: payload.dispatchConfirmationNumber,
  };
}
