import { useContext, useEffect, useRef } from "react"
import { createRaymarchProgram } from "src/preview/programs/raymarch"
import { AppContext } from "src/state/context"
import { Program } from "src/types"

interface Props {
  gl: WebGLRenderingContext | null
}

export function useRenderScene(props: Props): void {
  const { gl } = props
  const { camera, image } = useContext(AppContext)
  const requestId = useRef<number>(-1)
  const program = useRef<Program | null>(null)

  useEffect(() => {
    if (gl) {
      program.current = createRaymarchProgram(gl!)
    }
    return () => { program.current?.cleanup() }
  }, [gl])
  
  useEffect(() => {
    program.current?.updateCamera?.(camera)
  }, [camera, program, gl])
  
  useEffect(() => {
    image.image && program.current?.updateImage?.(image.image)
  }, [gl, image])
  
  useEffect(() => {
    const time = Date.now()
    draw(time)
    return () => { requestId.current && cancelAnimationFrame(requestId.current) }
  }, [draw])
  
  function draw(time: number): void {
  
    program.current?.draw(time)
    requestId.current = requestAnimationFrame(draw)
  }
}
