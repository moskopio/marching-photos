import { DeepPartial, Rotation, Track } from "src/types"
import { flipConstrain } from "src/utils/util"

import { limit } from "src/math/utls"
import { deepSet, deepUpdate } from "src/utils/merge"

export interface Camera {
  aspectRatio: number
  rotation:    Rotation
  dolly:       number
  track:       Track
}

export function createDefaultCamera(): Camera {
  const dpr = window.devicePixelRatio
  const displayWidth  = Math.round(window.innerWidth * dpr)
  const displayHeight = Math.round(window.innerHeight * dpr)
  
  return {
    aspectRatio: displayWidth / displayHeight,
    rotation:    { theta: 0, phi: 0 },
    dolly:       0,
    track:       { x: 0, y : 0 }
  }
}

export interface CameraAction extends DeepPartial<Camera> {
  type: 'update' | 'set' | 'reset'
}

export function cameraReducer(state: Camera, action: CameraAction): Camera {
  const newState = reduce(state, action)
  return constrain(newState)
}

function reduce(state: Camera, action: CameraAction): Camera {
  const { type, ...actionState } = action
  
  switch (type) {
    case 'update':
      return deepUpdate<Camera>(state, actionState)
    case 'set': 
      return deepSet<Camera>(state, actionState)
    case 'reset':
      return { ...createDefaultCamera(), aspectRatio: state.aspectRatio }
  }
}

function constrain(state: Camera): Camera {
  state.rotation.phi = flipConstrain(state.rotation.phi, -180, 180)
  state.rotation.theta = flipConstrain(state.rotation.theta, -180, 180)
  
  state.track.x = limit(state.track.x, -1, 1)
  state.track.y = limit(state.track.y, -1, 1)
  
  state.dolly = limit(state.dolly, -1, 1)
  
  return state
}
