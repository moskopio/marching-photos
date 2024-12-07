import { DeepPartial } from "src/types"

export interface ImageState {
  name:  string
  image: HTMLImageElement | null
}

export function createDefaultImageState(): ImageState {
  return { name: "", image: null }
}

export type ImageStateAction = DeepPartial<ImageState>

export function imageStateReducer(state: ImageState, action: ImageStateAction): ImageState {
  return {...state, ...action }
}
