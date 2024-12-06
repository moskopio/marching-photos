import { Dict } from "src/types"

interface Attribute {
  p: GLint,      // pointer
  s: number,     // size
  b: WebGLBuffer // buffer
}
type Attributes = Dict<Attribute>
type AttributeValue = Dict<Float32Array>

interface UpdateArgs {
  attributes: Attributes
  gl:         WebGL2RenderingContext
  values:     AttributeValue
}

export function updateAttributes(args: UpdateArgs): WebGLVertexArrayObject | null {
  const { attributes, gl, values } = args
  const attributeNames = Object.keys(values)
  
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  
  attributeNames.forEach(name => {
    const attribute = attributes[name]
    const value = values[name]
    
    if (attribute && value) {
      gl.enableVertexAttribArray(attribute.p)
      gl.bindBuffer(gl.ARRAY_BUFFER, attribute.b)
      gl.vertexAttribPointer(attribute.p, attribute.s, gl.FLOAT, false, 0, 0)
      gl.bufferData(gl.ARRAY_BUFFER, value, gl.STATIC_DRAW)
    }
  })
  
  return vao
}
