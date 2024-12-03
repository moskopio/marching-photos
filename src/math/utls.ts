export function degToRad(deg: number): number {
  return deg * Math.PI / 180
}

export function limit(value: number, min: number, max: number): number {
  return Math.max(Math.min(value, max), min)
}