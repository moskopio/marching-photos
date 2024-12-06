import { DeepPartial } from "src/types"
import { deepSet, deepUpdate } from "src/utils/merge"

export interface Settings {
  samples:    [number, number]
  push:       number
  shape:      Shape
  coloring:   Coloring
}

enum Shape {
  Sphere     = 0,
  Torus      = 1,
  Octahedron = 2,
  Box        = 3,
}

enum Coloring {
  Shaded    = 0,
  Simple    = 1,
  Grayscale = 2,
  White     = 3,
  Black     = 4,
}

export function createDefaultSettings(): Settings {
  return {
    samples:    [50, 50],
    push:       0.3,
    shape:      Shape.Sphere,
    coloring:   Coloring.Shaded,
  }
}

export interface SettingsAction extends DeepPartial<Settings> {
  type: 'update' | 'set'
}

export function settingsReducer(state: Settings, action: SettingsAction): Settings {
  const newState = reduce(state, action)
  return constrain(newState)
}

function reduce(state: Settings, action: SettingsAction): Settings {
  const { type, ...actionState } = action
  
  switch (type) {
    case 'update':
      return deepUpdate<Settings>(state, actionState)
    case 'set': 
      return deepSet<Settings>(state, actionState)
  }
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
