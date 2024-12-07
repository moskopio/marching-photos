import { DeepPartial, Rotation } from "src/types"
import { flipConstrain } from "src/utils/util"

import { deepSet, deepUpdate } from "src/utils/merge"
import { limit } from "src/utils/util"

export interface Camera {
  aspectRatio: number
  rotation:    Rotation
  dolly:       number
}

export function createDefaultCamera(): Camera {
  const dpr = window.devicePixelRatio
  const displayWidth  = Math.round(window.innerWidth * dpr)
  const displayHeight = Math.round(window.innerHeight * dpr)
  
  return {
    aspectRatio: displayWidth / displayHeight,
    rotation:    { theta: 0, phi: 0 },
    dolly:       0.3,
  }
}

export interface CameraAction extends DeepPartial<Camera> {
  type: "update" | "set"
}

export function cameraReducer(state: Camera, action: CameraAction): Camera {
  const newState = reduce(state, action)
  return constrain(newState)
}

function reduce(state: Camera, action: CameraAction): Camera {
  const { type, ...actionState } = action
  
  switch (type) {
    case "update":
      return deepUpdate<Camera>(state, actionState)
    case "set": 
      return deepSet<Camera>(state, actionState)
  }
}

function constrain(state: Camera): Camera {
  state.rotation.phi = flipConstrain(state.rotation.phi, -180, 180)
  state.rotation.theta = flipConstrain(state.rotation.theta, -180, 180)
  
  state.dolly = limit(state.dolly, 0, 0.6)
  
  return state
}
