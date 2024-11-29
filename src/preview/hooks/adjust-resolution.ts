import { useEffect } from "react"
import { Resolution } from "src/types"

interface Props {
  gl:         WebGLRenderingContext | null
  resolution: Resolution
}

export function useAdjustResolution(props: Props): void {
  const { gl, resolution } = props
  useEffect(() => {
    const [width, height] = resolution
    gl?.viewport(0, 0, width, height)
  }, [gl, resolution])
}
