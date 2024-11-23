import fragmentShaderSource from 'src/preview/glsl/raymarch.frag'
import vertexShaderSource from 'src/preview/glsl/raymarch.vert'
import { Program, Settings } from 'src/types'
import { setupAttributes, updateAttributes } from 'src/webgl/attributes'
import { createShaderProgram } from 'src/webgl/program'
import { getUniforms, updateUniforms } from 'src/webgl/uniforms'

export function createRaymarchProgram(gl: WebGLRenderingContext): Program | null {
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)
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
  
  return { cleanup, draw, updateSettings }
  
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
  
  function updateSettings(settings: Settings): void {
    const { resolution } = settings
    const { width, height } = resolution
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values: { resolution: [width, height] } })
  }
}
