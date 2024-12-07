import fragmentShaderSource from "src/preview/glsl/raymarch.frag"
import vertexShaderSource from "src/preview/glsl/raymarch.vert"
import { createShaderSource } from "src/preview/glsl/utils"
import { Camera } from "src/state/camera"
import { AdvancedSettings, Settings } from "src/state/settings"
import { Program } from "src/types"
import { degToRad } from "src/utils/util"
import { updateAttributes } from "src/webgl/attributes"
import { createShaderProgram } from "src/webgl/program"
import { getUniforms, prepareUniformsValues, updateUniforms } from "src/webgl/uniforms"

export function createRaymarchProgram(gl: WebGL2RenderingContext): Program | null {
  const fragmentSourceComposed = createShaderSource(fragmentShaderSource)
  const program = createShaderProgram(gl, vertexShaderSource, fragmentSourceComposed)
  if (!program) {
    console.error("Failed to create a WebGL2 Program")
    return null
  }
  
  const attributes = {
    position: { p: gl.getAttribLocation(program, "aPosition"), s: 2, b: gl.createBuffer()! },
  }
  
  const uniforms = getUniforms(gl, program)
  const position = new Float32Array([
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // first triangle
    0.0, 1.0, 1.0, 0.0, 1.0, 1.0  // second triangle
   ])
   updateAttributes({ gl, attributes, values: { position } })
   const texture = gl.createTexture()
  
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
    
    const values = prepareUniformsValues({
      aspectRatio,
      dolly,
      rotation: [degToRad(theta), degToRad(phi)],
    })
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function updateImage(image: HTMLImageElement): void {
    gl.useProgram(program!)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    updateUniforms({ gl, uniforms, values: { imgAspectRatio: [image.width / image.height] } })
  }
  
  function updateSettings(settings: Settings): void {
    const { advanced, ...rest } = settings
    
    const flags = buildFlags(advanced)
    const values = prepareUniformsValues({ flags, ...rest })
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
}

// TODO: clean it up!
function buildFlags(advanced: AdvancedSettings): number {
  let flags = 0
  flags |= advanced.shadingDisabled ? flags | 1  : flags
  flags |= advanced.scalingDisabled ? flags | 2  : flags
  flags |= advanced.scalingReversed ? flags | 4  : flags
  flags |= advanced.colorReversed   ? flags | 8  : flags
  flags |= advanced.pushDisabled    ? flags | 16 : flags
  flags |= advanced.pushReversed    ? flags | 32 : flags
  
  return flags
}
