import normals from './normals.glsl'
import operators from './operators.glsl'
import primitives from './primitives.glsl'
import rotations from './rotations.glsl'
import scene from './scene.glsl'
import shading from './shading.glsl'
import uniforms from './uniforms.glsl'

export function createShaderSource(shaderSource: string): string {
  return [
    uniforms,
    operators,
    primitives,
    rotations,
    shading,
    scene,
    normals,
    shaderSource
  ].join('\n')
}
