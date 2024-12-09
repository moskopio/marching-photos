import { DeepPartial } from "src/types"
import { deepSet } from "src/utils/merge"

export interface Settings {
  samples:  [number, number]
  push:     number
  shape:    Shape
  coloring: Coloring
  advanced: AdvancedSettings
}

export interface AdvancedSettings {
  shadingDisabled: boolean
  colorReversed:   boolean
  scalingReversed: boolean
  scalingDisabled: boolean
  pushDisabled:    boolean
  noiseEnabled:    boolean
  backgroundWhite: boolean
}

enum Shape {
  Sphere     = 0,
  Torus      = 1,
  Octahedron = 2,
  Box        = 3,
}

enum Coloring {
  Shaded    = 0,
  Grayscale = 1,
  White     = 2,
  Black     = 3,
}

export function createDefaultSettings(): Settings {
  return {
    samples:    [64, 64],
    push:       0.3,
    shape:      Shape.Sphere,
    coloring:   Coloring.Shaded,
    advanced: {
      shadingDisabled: true,
      colorReversed:   false,
      scalingReversed: false,
      scalingDisabled: false,
      pushDisabled:    false,
      noiseEnabled:    false,
      backgroundWhite: false,
    }
  }
}

export type SettingsAction = DeepPartial<Settings>

export function settingsReducer(state: Settings, action: SettingsAction): Settings {
  const newState = reduce(state, action)
  return constrain(newState)
}

function reduce(state: Settings, action: SettingsAction): Settings {
  return deepSet<Settings>(state, action)
}

function constrain(state: Settings): Settings {
  state.push = state.push < 0.5 ? state.push : 0.5
  state.samples[0] = Math.floor(state.samples[0])
  state.samples[0] = state.samples[0] % 2 
    ? state.samples[0] - 1 
    : state.samples[0]
  
  state.samples[1] = Math.floor(state.samples[1])
  state.samples[1] = state.samples[1] % 2 
    ? state.samples[1] - 1 
    : state.samples[1]
    
  return state
}
