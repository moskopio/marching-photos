import { createContext, Dispatch, Reducer, useMemo, useReducer } from "react"
import { Camera, CameraAction, cameraReducer, createDefaultCamera } from "./camera"

interface AppState {
  camera:         Camera,
  cameraDispatch: Dispatch<CameraAction>
}

export const AppContext = createContext<AppState>({
  camera:         createDefaultCamera(),
  cameraDispatch: () => {},
})

export function useAppState(): AppState {
  const [camera, cameraDispatch] = useReducer<Reducer<Camera, CameraAction>>(cameraReducer, createDefaultCamera())
  
  return useMemo(() => ({
    camera, cameraDispatch,
  }),[camera, cameraDispatch])
}
