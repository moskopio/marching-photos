import { ReactElement, useContext, useLayoutEffect, useRef, useState } from "react"
import { useWebGLContext } from "src/preview/hooks/webgl-context"
import { AppContext } from "src/state/context"
import { Resolution } from "src/types"
import './WebGLPreview.css'
import { useMouseCameraControls } from "./hooks/mouse-camera-controls"
import { useRenderScene } from "./hooks/render-scene"
import { useTouchCameraControls } from "./hooks/touch-camera-controls"

export function WebGLPreview(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [resolution, setResolution] = useState<Resolution>([ window.innerWidth, window.innerHeight])
  const { cameraDispatch } = useContext(AppContext)
  
  const gl = useWebGLContext({ canvasRef })
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
      
      gl?.viewport(0, 0, displayWidth, displayHeight)
      setResolution([displayWidth, displayHeight])
      cameraDispatch({ type: 'set', aspectRatio: displayWidth / displayHeight})
    }
  }, [gl, setResolution, cameraDispatch])
  
  return (
    <canvas
      ref={canvasRef}
      className="webgl-canvas"
      width={resolution[0]}
      height={resolution[1]}
    />
  )
}
