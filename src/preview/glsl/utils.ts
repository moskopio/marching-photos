import normals from './normals.glsl'
import primitives from './primitives.glsl'
import scene from './scene.glsl'
import shading from './shading.glsl'
import header from './header.glsl'

export function createShaderSource(shaderSource: string): string {
  return [
    header,
    primitives,
    shading,
    scene,
    normals,
    shaderSource
  ].join('\n')
}
