import { ReactElement, useEffect, useMemo, useRef, useState } from "react"
import { constrain } from "src/utils/util"
import { ColorsPanel } from "./Colors"
import { ImagePanel } from "./Image"
import { SamplesPanel } from "./Samples"
import "./Panels.css"

const MARGIN = 8
const SCROLL_SPEED = 20

export function Panels(): ReactElement {
  const panelsRef = useRef<HTMLDivElement | null>(null)
  const [scroll, setScroll] = useState(0)

  const style = useMemo(() => ({
    marginTop: `${MARGIN}px`,
    top:       `${scroll}px`
  }), [scroll])
  
  useEffect(() => {
    const panels = panelsRef.current
    panels?.addEventListener("wheel", onWheel)
    return () => panels?.removeEventListener("wheel", onWheel)
    
    function onWheel(event: WheelEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      
      const panelsHeight = (panels?.getBoundingClientRect().height || 0) + MARGIN
      
      const heightDiff = panelsHeight - window.innerHeight
      if (heightDiff > 0) {
        const change = event.deltaY > 0 ? -SCROLL_SPEED : SCROLL_SPEED
        setScroll(constrain(scroll + change, -heightDiff, 0))
      }
    }
  }, [panelsRef, scroll, setScroll])
  
  useEffect(() => {
    const panels = panelsRef.current
    const resizeObserver = new ResizeObserver(() => {
      const windowHeight = window.innerHeight
      const panelsHeight = (panels?.getBoundingClientRect().height || 0) + MARGIN
      panelsHeight < windowHeight && setScroll(0)
    })
    panels && resizeObserver.observe(panels)
    return () => resizeObserver.disconnect()
  }, [panelsRef, setScroll])
  
  return (
    <div className="panels" ref={panelsRef} style={style}>
      <ImagePanel />
      <SamplesPanel />
      <ColorsPanel />
    </div>
  )
}
