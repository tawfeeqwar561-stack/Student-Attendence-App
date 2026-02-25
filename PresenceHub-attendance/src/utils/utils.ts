import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercentage(present: number, total: number) {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
}
