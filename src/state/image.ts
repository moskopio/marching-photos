import { DeepPartial } from "src/types"

export interface ImageState {
  name:  string
  image: HTMLImageElement | null
}

export function createEmptyImageState(): ImageState {
  return {
    name: '',
    image: null
  }
}

export function createDefaultImageState(): ImageState {
  const image = new Image()
  image.src = '/marching-photos/cat3.jpg'
    
  return {
    image,
    name: 'cat2.jpg'
  }
}

export type ImageStateAction = DeepPartial<ImageState>

export function imageStateReducer(state: ImageState, action: ImageStateAction): ImageState {
  return {...state, ...action }
}
