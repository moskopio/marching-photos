import { DeepPartial } from "src/types"
import { deepSet, deepUpdate } from "src/utils/merge"

export interface Settings {
  samples:    [number, number]
  push:       number
  shape:      Shape
  coloring:   Coloring
  solidColor: [number, number, number]
}

enum Shape {
  Sphere     = 0,
  Torus      = 1,
  Octahedron = 2,
  Box        = 3,
}

enum Coloring {
  Image = 0,
  BW    = 1,
  Solid = 2,
}

export function createDefaultSettings(): Settings {
  return {
    samples:    [100, 100],
    push:       0.3,
    shape:      Shape.Sphere,
    coloring:   Coloring.Image,
    solidColor: [1, 1, 1],
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
  return state
}
