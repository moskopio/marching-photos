import { createContext, Dispatch, Reducer, useMemo, useReducer } from "react"
import { Camera, CameraAction, cameraReducer, createDefaultCamera } from "./camera"
import { createDefaultImageState, createEmptyImageState, ImageState, ImageStateAction, imageStateReducer } from "src/state/image"

interface AppState {
  camera:         Camera,
  cameraDispatch: Dispatch<CameraAction>
  image:          ImageState,
  imageDispatch:  Dispatch<ImageStateAction>
}

export const AppContext = createContext<AppState>({
  camera:         createDefaultCamera(),
  cameraDispatch: () => {},
  image:          createEmptyImageState(),
  imageDispatch:  () => {},
})

export function useAppState(): AppState {
  const [camera, cameraDispatch] = useReducer<Reducer<Camera, CameraAction>>(cameraReducer, createDefaultCamera())
  const [image, imageDispatch] = useReducer<Reducer<ImageState, ImageStateAction>>(imageStateReducer, createDefaultImageState())
  
  return useMemo(() => ({
    camera, cameraDispatch,
    image, imageDispatch,
  }),[camera, cameraDispatch, image, imageDispatch])
}
