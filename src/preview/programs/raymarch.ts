import { degToRad } from 'src/math/utls'
import fragmentShaderSource from 'src/preview/glsl/raymarch.frag'
import vertexShaderSource from 'src/preview/glsl/raymarch.vert'
import { createShaderSource } from 'src/preview/glsl/utils'
import { Camera } from 'src/state/camera'
import { Settings } from 'src/state/settings'
import { Program } from 'src/types'
import { updateAttributes } from 'src/webgl/attributes'
import { createShaderProgram } from 'src/webgl/program'
import { getUniforms, prepareValues, updateUniforms } from 'src/webgl/uniforms'

export function createRaymarchProgram(gl: WebGL2RenderingContext): Program | null {
  
  const fragmentSourceComposed = createShaderSource(fragmentShaderSource)
  const program = createShaderProgram(gl, vertexShaderSource, fragmentSourceComposed)
  if (!program) {
    console.error('Failed to create a WebGL2 Program')
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
    1.0,  1.0
   ])
   updateAttributes({ gl, attributes, values: { position } })
  
  return { cleanup, draw, updateCamera, updateImage, updateSettings }
  
  function cleanup(): void {
    Object.values(attributes).forEach(a => gl.deleteBuffer(a.b))
    gl.deleteProgram(program!)
  }
  
  function draw(time: number): void {
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values: { time: [time] } })
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }
  
  function updateCamera(camera: Camera): void {
    const { rotation, aspectRatio, dolly } = camera
    const { theta, phi } = rotation
    
    gl.useProgram(program!)
    
    const values = prepareValues({
      aspectRatio,
      dolly,
      rotation: [degToRad(theta), degToRad(phi)],
    })
    updateUniforms({ gl, uniforms, values })
  }
  
  function updateImage(image: HTMLImageElement): void {
    image.onload = function() {
      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      updateUniforms({ gl, uniforms, values: { imgAspectRatio: [image.width / image.height] } })
    }
  }
  
  function updateSettings(settings: Settings): void {
    const { ...rest } = settings
    
    gl.useProgram(program!)
    const values = prepareValues(rest)
    updateUniforms({ gl, uniforms, values })
  }
}
