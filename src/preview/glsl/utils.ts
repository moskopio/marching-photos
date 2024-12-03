import light from './light.glsl'
import operators from './operators.glsl'
import precision from './precision.glsl'
import primitives from './primitives.glsl'
import rotations from './rotations.glsl'
import shadingLambert from './shading-lambert.glsl'
import shadow from './shadow.glsl'
import ao from './ao.glsl'
import scene from './scene.glsl'
import normals from './normals.glsl'

export function createShaderSource(shaderSource: string): string {
  return [
    precision,
    operators,
    primitives,
    rotations,
    light,
    shadingLambert,
    scene,
    normals,
    shadow,
    ao,
    shaderSource
  ].join('\n')
}
