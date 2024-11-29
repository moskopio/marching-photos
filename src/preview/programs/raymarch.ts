import { degToRad } from 'src/math/utls'
import fragmentShaderSource from 'src/preview/glsl/raymarch.frag'
import vertexShaderSource from 'src/preview/glsl/raymarch.vert'
import { createShaderSource } from 'src/preview/glsl/utils'
import { Camera } from 'src/state/camera'
import { Program } from 'src/types'
import { setupAttributes, updateAttributes } from 'src/webgl/attributes'
import { createShaderProgram } from 'src/webgl/program'
import { getUniforms, prepareValues, updateUniforms } from 'src/webgl/uniforms'

export function createRaymarchProgram(gl: WebGLRenderingContext): Program | null {
  
  const fragmentSourceComposed = createShaderSource(fragmentShaderSource)
  const program = createShaderProgram(gl, vertexShaderSource, fragmentSourceComposed)
  if (!program) {
    console.error('Failed to create a WebGL Wireframe Program')
    return null
  }
  const attributes = {
    position: { p: gl.getAttribLocation(program, 'aPosition'), s: 2, b: gl.createBuffer()! },
  }
  const uniforms = getUniforms(gl, program)
  const position = new Float32Array([
    0.0,  0.0,
    1.0,  0.0,
    0.0,  1.0,
    0.0,  1.0,
    1.0,  0.0,
    1.0,  1.0])
    
  return { cleanup, draw, updateCamera }
  
  function cleanup(): void {
    Object.values(attributes).forEach(a => gl.deleteBuffer(a.b))
    gl.deleteProgram(program!)
  }
  
  function draw(time: number): void {
    gl.useProgram(program!)
    setupAttributes({ gl, attributes })

    updateAttributes({ gl, attributes, values: { position } })
    updateUniforms({ gl, uniforms, values: { time: [time] } })
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }
  
  function updateCamera(camera: Camera): void {
    const { rotation, aspectRatio, track, dolly } = camera
    const { theta, phi } = rotation
    
    const { x, y } = track
    gl.useProgram(program!)
    
    const values = prepareValues({
      aspectRatio, 
      track: [x, y], 
      rotation: [degToRad(theta), degToRad(phi)],
      dolly: [dolly]
    })
    updateUniforms({ gl, uniforms, values })
  }
}
