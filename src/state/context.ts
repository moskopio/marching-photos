import { createContext, Dispatch, Reducer, useMemo, useReducer } from "react"
import { Camera, CameraAction, cameraReducer, createDefaultCamera } from "./camera"
import { createDefaultImageState, createEmptyImageState, ImageState, ImageStateAction, imageStateReducer } from "./image"
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
  image:            createEmptyImageState(),
  imageDispatch:    () => {},
  settings:         createDefaultSettings(),
  settingsDispatch: () => {},
})

export function useAppState(): AppState {
  const [camera, cameraDispatch] = useReducer<Reducer<Camera, CameraAction>>(cameraReducer, createDefaultCamera())
  const [image, imageDispatch] = useReducer<Reducer<ImageState, ImageStateAction>>(imageStateReducer, createDefaultImageState())
  const [settings, settingsDispatch] = useReducer<Reducer<Settings, SettingsAction>>(settingsReducer, createDefaultSettings())
  
  return useMemo(() => ({
    camera, cameraDispatch,
    image, imageDispatch,
    settings, settingsDispatch,
  }),[camera, cameraDispatch, image, imageDispatch, settings, settingsDispatch])
}
