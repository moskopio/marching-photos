import light from './light.glsl'
import operators from './operators.glsl'
import precision from './precision.glsl'
import primitives from './primitives.glsl'
import rotations from './rotations.glsl'
import shadingLambert from './shading-lambert.glsl'

export function createShaderSource(shaderSource: string): string {
  return [
    precision,
    operators,
    primitives,
    rotations,
    light,
    shadingLambert,
    shaderSource
  ].join('\n')
}
