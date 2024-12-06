import { Camera } from "src/state/camera"
import { Settings } from "src/state/settings"

export type Vec3 = [number, number, number]
export type Vec4 = [number, number, number, number]
export type Matrix4 = number[]
export type FileContent = string | ArrayBuffer | null | undefined

export interface Dict<T> {
  [key: string]: T | undefined
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export type ViewMatrices = Dict<Matrix4 | Vec3>

export interface Program {
  cleanup:        () => void
  draw:           (time: number) => void
  updateCamera:   (views: Camera) => void
  updateImage:    (image: HTMLImageElement) => void
  updateSettings: (settings: Settings) => void
}

export type Resolution = [width: number, height: number]

export interface Rotation {
  theta: number
  phi:   number
}

export interface Track {
  x: number
  y: number
}
