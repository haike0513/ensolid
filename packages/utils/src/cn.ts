import { type ClassValue, clsx } from "clsx";

/**
 * 合并类名的工具函数
 * 用于合并和去重类名
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
