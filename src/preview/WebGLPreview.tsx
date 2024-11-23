import { ReactElement, useLayoutEffect, useRef, useState } from "react"
import { useAdjustResolution } from "src/preview/hooks/adjust-resolution"
import { useWebGLContext } from "src/preview/hooks/webgl-context"
import './WebGLPreview.css'
import { useMouseCameraControls } from "./hooks/mouse-camera-controls"
import { useTouchCameraControls } from "./hooks/touch-camera-controls"
import { useRenderScene } from "src/preview/hooks/raymarch"

export function WebGLPreview(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [resolution, setResolution] = useState({ width: window.innerWidth, height: window.innerHeight })
  
  const gl = useWebGLContext({ canvasRef })
  useAdjustResolution({gl, resolution })
  useMouseCameraControls()
  useTouchCameraControls({ canvasRef })
  useRenderScene({ gl })
  
  useLayoutEffect(() => {
    window.addEventListener('resize', updateResolution)
    return () => window.removeEventListener('resize', updateResolution)
    
    function updateResolution(): void {
      const dpr = window.devicePixelRatio
      const displayWidth  = Math.round(window.innerWidth * dpr)
      const displayHeight = Math.round(window.innerHeight * dpr)
    
      setResolution({ width: displayWidth, height: displayHeight })
    }
  }, [gl, setResolution])
  
  return (
    <canvas
      ref={canvasRef}
      className="webgl-canvas"
      width={resolution.width}
      height={resolution.height}
    />
  )
}