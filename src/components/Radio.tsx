import { ReactElement, useCallback, useEffect, useRef } from "react"
import { createPallette } from "src/utils/pallette"
import "./Radio.css"

interface Options {
  [key: number]: string
}

interface Props {
  options:  Options
  onChange: (option: number) => void
  value:    number
}

const ANGLES = [45, 75, 105, 130, 140]

export function Radio(props: Props): ReactElement {
  const { options, value, onChange } = props
  const optionsKeys = Object.keys(options).map(key => Number(key))
  const pallette = createPallette()
  
  const dialStyle = { transform: `rotate(${ANGLES[value]}deg)`}
  const markStyle = { background: pallette.getColor(value) }
  
  const onClick = useCallback(() => {
    const newValue = value + 1 < optionsKeys.length ? value + 1 : 0
    onChange(newValue)
  },
  [optionsKeys, value, onChange])
  
  return (
    <div className="radio">
      <div className="radio-dial" onClick={onClick}>
        <div className="radio-dial-face" style={dialStyle}>
          <div className="radio-dial-mark" style={markStyle} />
        </div>
      </div>
      <div className="radio-buttons">
        {optionsKeys.map(key => 
        <RadioButton key={key} id={key} label={options[key] || `${key}`} {...props} />)
        }
      </div>
    </div>
  )
}

interface RadioButtonProps {
  id:       number
  label:    string
  value:    number
  onChange: (option: number) => void
}
function RadioButton(props: RadioButtonProps): ReactElement {
  const { id, label, value, onChange } = props
  const buttonRef = useRef<HTMLDivElement | null>(null)
  const pallette = createPallette(id)
  
  // Looks overcomplicated, but it is necessary (possibly?), to avoid click delays
  useEffect(() => {
    const checkbox = buttonRef.current
    const onClick = () => onChange(id)
    
    checkbox?.addEventListener("mousedown", onClick)
    return () => checkbox?.removeEventListener("mousedown", onClick)
  },[onChange, buttonRef, value, id])
  
  const style = { background: value === id? pallette.getNextColor() : 'var(--bg-color-2)' }
  
  return (
    <div className="radio-button" ref={buttonRef} >
      <div className={`radio-button-box ${value === id ? 'check' : ''}`} style={style} />
      <div className="radio-button-label">{label}</div>
    </div>
  )
}

