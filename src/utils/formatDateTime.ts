// src/utils/formatDateTime.ts
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";

// Fecha en formato YYYY-MM-DD
export function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

// Hora en formato HH:mm:ss
export function formatTime(date: Date): string {
  return format(date, "HH:mm:ss");
}

// Para GGo: deliveryPlannedDate en UTC
export function formatUtcDateTime(date: Date): string {
  return date.toISOString(); // siempre UTC
}

// Para mostrar fechas guardadas como string "yyyy-MM-dd"
export function prettyDate(dateStr: string | null): string {
  if (!dateStr) return "No registrada";
  return format(parse(dateStr, "yyyy-MM-dd", new Date()), "PPP", { locale: es });
}

// Para mostrar horas guardadas como string "HH:mm:ss"
export function prettyTime(timeStr: string | null): string {
  if (!timeStr) return "Sin hora registrada";
  return timeStr.slice(0, 5); // "16:00:00" -> "16:00"
}