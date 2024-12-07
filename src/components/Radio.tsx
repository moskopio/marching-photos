import { ReactElement, useEffect, useRef } from "react"
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

export function Radio(props: Props): ReactElement {
  const { options } = props
  const checkboxRef = useRef<HTMLDivElement | null>(null)
  
  const optionsKeys = Object.keys(options).map(key => Number(key))
  
  return (
    <div className="radio" ref={checkboxRef}>
      {optionsKeys.map(key => 
      <RadioButton key={key} id={key} label={options[key] || `${key}`} {...props} />)
      }
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

