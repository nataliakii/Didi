export const ORDER_STATUSES = [
  "new",
  "paid",
  "in_production",
  "ready_for_pickup",
  "shipped",
  "completed",
  "cancelled",
  "refunded",
] as const;

export const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
  "partially_refunded",
] as const;

export const APPOINTMENT_STATUSES = [
  "requested",
  "confirmed",
  "rescheduled",
  "completed",
  "cancelled",
] as const;

export const APPOINTMENT_TYPES = [
  "engagement-ring-consultation",
  "diamond-consultation",
  "custom-jewellery-consultation",
  "ring-sizing",
  "virtual-appointment",
  "in-store-appointment",
] as const;

export const USER_ROLES = ["super_admin", "admin", "manager"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];
export type AppointmentType = (typeof APPOINTMENT_TYPES)[number];
export type UserRole = (typeof USER_ROLES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "New",
  paid: "Paid",
  in_production: "In Production",
  ready_for_pickup: "Ready for Pickup",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
  partially_refunded: "Partially Refunded",
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  rescheduled: "Rescheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  "engagement-ring-consultation": "Engagement Ring Consultation",
  "diamond-consultation": "Diamond Consultation",
  "custom-jewellery-consultation": "Custom Jewellery Consultation",
  "ring-sizing": "Ring Sizing",
  "virtual-appointment": "Virtual Appointment",
  "in-store-appointment": "In-Store Appointment",
};
