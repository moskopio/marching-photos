import { Matrix4 } from "src/math/m4"
import { Vec3 } from "src/math/v3"

export type FileContent = string | ArrayBuffer | null | undefined

export interface Dict<T> {
  [key: string]: T | undefined
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export type ViewMatrices = Dict<Matrix4 | Vec3>

export interface Program {
  cleanup:         () => void
  draw:            (time: number) => void
  updateSettings?: (settings: Settings) => void
  updateCamera?:   (views: ViewMatrices) => void
}

export interface Settings {
  resolution: Resolution
}

export interface Resolution {
  width:  number
  height: number
}

export interface Rotation {
  theta: number
  phi:   number
}

export interface Track {
  x: number
  y: number
}
