export function formatMoney(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: paise % 100 === 0 ? 0 : 2
  }).format(paise / 100);
}

export function formatUnit(unit: string) {
  if (unit === "piece") return "piece";
  if (unit === "kg") return "kg";
  if (unit === "litre") return "litre";
  return unit;
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function formatTime(value: string | null) {
  if (!value) return "";
  const [hour = "00", minute = "00"] = value.split(":");
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(new Date(2024, 0, 1, Number(hour), Number(minute)));
}
