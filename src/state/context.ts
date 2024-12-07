import { createContext, Dispatch, Reducer, useEffect, useMemo, useReducer } from "react"
import { Camera, CameraAction, cameraReducer, createDefaultCamera } from "./camera"
import { createDefaultImageState, ImageState, ImageStateAction, imageStateReducer } from "./image"
import { createDefaultSettings, Settings, SettingsAction, settingsReducer } from "./settings"

interface AppState {
  camera:           Camera,
  cameraDispatch:   Dispatch<CameraAction>
  image:            ImageState,
  imageDispatch:    Dispatch<ImageStateAction>
  settings:         Settings,
  settingsDispatch: Dispatch<SettingsAction>
}

export const AppContext = createContext<AppState>({
  camera:           createDefaultCamera(),
  cameraDispatch:   () => {},
  image:            createDefaultImageState(),
  imageDispatch:    () => {},
  settings:         createDefaultSettings(),
  settingsDispatch: () => {},
})

export function useAppState(): AppState {
  const [camera, cameraDispatch] = useReducer<Reducer<Camera, CameraAction>>(cameraReducer, createDefaultCamera())
  const [image, imageDispatch] = useReducer<Reducer<ImageState, ImageStateAction>>(imageStateReducer, createDefaultImageState())
  const [settings, settingsDispatch] = useReducer<Reducer<Settings, SettingsAction>>(settingsReducer, createDefaultSettings())
  
  useEffect(() => {
    const image = new Image()
    image.onload = (): void => imageDispatch({ image, name: "cat2.jpg" })
    image.src = image.src = "/marching-photos/cat3.jpg"
  }, [imageDispatch])
  
  return useMemo(() => ({
    camera, cameraDispatch,
    image, imageDispatch,
    settings, settingsDispatch,
  }),[camera, cameraDispatch, image, imageDispatch, settings, settingsDispatch])
}
