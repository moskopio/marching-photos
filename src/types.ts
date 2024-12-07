import { Camera } from "src/state/camera"
import { Settings } from "src/state/settings"

export interface Dict<T> {
  [key: string]: T | undefined
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export interface Program {
  cleanup:        () => void
  draw:           (time: number) => void
  updateCamera:   (views: Camera) => void
  updateImage:    (image: HTMLImageElement) => void
  updateSettings: (settings: Settings) => void
}

export type Resolution = [width: number, height: number]

// TODO: could be replaced with number array
export interface Rotation {
  theta: number
  phi:   number
}
