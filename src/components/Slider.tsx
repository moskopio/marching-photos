import { ReactElement, useMemo, useRef } from "react"
import { PASTEL_COLORS } from "src/utils/pallette"
import { getPercentage } from "src/utils/util"
import { useSliderMouseDrag } from "./hooks/slider-mouse-drag"
import "./Slider.css"

interface Props {
  label:         string
  min:           number
  max:           number
  onChange:      (value: number) => void
  value:         number
  defaultValue?: number
  color?:        string
}

export function Slider(props: Props): ReactElement {
  const { label, min, max, onChange, value } = props
  const { defaultValue = 0, color = PASTEL_COLORS.mojo } = props
  const sliderRef = useRef<HTMLDivElement | null>(null)
  
  useSliderMouseDrag({ sliderRef, min, max, onChange, defaultValue })
  
  const handleStyle = useMemo(() => ({
      width: `${getPercentage(value, min, max)}%`,
      background: `${color}`
  }), [value, color])
  
  return (
    <div className="slider" ref={sliderRef}>
      <div className="slider-track">
        <div className="slider-handle" style={handleStyle} />
        <div className="slider-label">{label}</div>
      </div>
    </div>
  )
}
