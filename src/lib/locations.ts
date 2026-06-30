/** NFCタグの location_id と施設名の対応（要件定義 §14） */
export const LOCATIONS = {
  saitama: "埼玉/熊谷",
  obuse: "小布施",
  aichi: "愛知",
} as const;

export type LocationId = keyof typeof LOCATIONS;

export function isValidLocationId(id: string): id is LocationId {
  return id in LOCATIONS;
}
