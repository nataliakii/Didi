import { BRAND_CONTACT } from "@/constants/contact";
import { BRAND_NAME } from "@/constants/brand";
import { getNotifyEmail, isEmailConfigured, sendMail } from "@/lib/email";
import type { CreateAppointmentInput } from "@/types/appointment";

function formatAppointmentType(type: string): string {
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatPreferredDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function sendAppointmentEmails(
  input: CreateAppointmentInput,
  appointmentId: string,
): Promise<void> {
  if (!isEmailConfigured()) {
    console.warn(
      "[appointment-email] Skipped — SMTP not configured. Appointment saved:",
      appointmentId,
    );
    return;
  }

  const typeLabel = formatAppointmentType(input.appointmentType);
  const dateLabel = formatPreferredDate(input.preferredDate);
  const notifyTo = getNotifyEmail();

  const customerText = [
    `Dear ${input.name},`,
    "",
    `Thank you for requesting an appointment with ${BRAND_NAME}.`,
    "",
    "We have received your request and will contact you shortly to confirm the date and time.",
    "",
    "Your request:",
    `• Type: ${typeLabel}`,
    `• Preferred date: ${dateLabel}`,
    `• Preferred time: ${input.preferredTime}`,
    input.budget ? `• Budget: ${input.budget}` : null,
    input.message ? `• Message: ${input.message}` : null,
    "",
    "With care,",
    BRAND_NAME,
    BRAND_CONTACT.email,
    BRAND_CONTACT.phone,
    BRAND_CONTACT.website,
  ]
    .filter(Boolean)
    .join("\n");

  const houseText = [
    `New appointment request (#${appointmentId})`,
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    `Type: ${typeLabel}`,
    `Preferred date: ${dateLabel}`,
    `Preferred time: ${input.preferredTime}`,
    input.budget ? `Budget: ${input.budget}` : null,
    input.message ? `Message: ${input.message}` : null,
    input.locale ? `Locale: ${input.locale}` : null,
    "",
    "Open admin → Appointments to follow up.",
  ]
    .filter(Boolean)
    .join("\n");

  const [customerResult, houseResult] = await Promise.all([
    sendMail({
      to: input.email,
      subject: `Appointment request received — ${BRAND_NAME}`,
      text: customerText,
      replyTo: notifyTo,
    }),
    sendMail({
      to: notifyTo,
      subject: `New appointment: ${input.name} — ${typeLabel}`,
      text: houseText,
      replyTo: input.email,
    }),
  ]);

  if (!customerResult.sent) {
    console.error(
      "[appointment-email] Customer email failed:",
      customerResult.reason,
    );
  }
  if (!houseResult.sent) {
    console.error(
      "[appointment-email] House notification failed:",
      houseResult.reason,
    );
  }
}
