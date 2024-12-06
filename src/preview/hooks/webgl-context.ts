import { MutableRefObject, useEffect, useState } from "react"

interface Props {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>
}

export function useWebGLContext(props: Props): WebGL2RenderingContext | null {
  const { canvasRef } = props 
  const [context, setContext] = useState<WebGL2RenderingContext | null>(null)
  
  useEffect(() => {
    const gl = canvasRef.current?.getContext("webgl2", {antialias: true })
    
    
    gl && setContext(gl)
  }, [canvasRef])
  
  return context
}
