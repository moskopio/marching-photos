import { flipConstrain } from "src/utils/util"
import { DeepPartial, Rotation, Track, Vec3 } from "src/types"

import { deepSet, deepUpdate } from "src/utils/merge"
import { limit } from "src/math/utls"

export interface Camera { 
  aspectRatio: number
  target:      Vec3
  rotation:    Rotation
  dolly:       number
  track:       Track
}

export function createDefaultCamera(): Camera {
  return {
    aspectRatio: 3 / 2,
    target:      [0, 0, 0] as Vec3,
    rotation:    { theta: 30, phi: 0 },
    dolly:       0.3,
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
  
  state.track.x = limit(state.track.x, -10, 10)
  state.track.y = limit(state.track.y, -10, 10)
  
  state.dolly = limit(state.dolly, 0.0, 1)
  
  return state
}
