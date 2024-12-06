import { ReactElement } from "react"
import "./Icon.css"

interface Props {
  onClick?: () => void
}

export function IconCamera(props: Props): ReactElement {
  return (
    <div className="icon-wrapper"> 
      <div className="icon icon-camera" onClick={props?.onClick} /> 
    </div>
  )
}

export function IconInfo(props: Props): ReactElement {
  return (
    <div className="icon-wrapper"> 
      <div className="icon icon-info" onClick={props?.onClick} /> 
    </div>
  )
}

export function IconSettings(props: Props): ReactElement {
  return (
    <div className="icon-wrapper"> 
      <div className="icon icon-settings" onClick={props?.onClick} /> 
    </div>
  )
}

export function IconFile(props: Props): ReactElement {
  return (
    <div className="icon-wrapper"> 
      <div className="icon icon-file" onClick={props?.onClick} /> 
    </div>
  )
}

export function IconLight(props: Props): ReactElement {
  return (
    <div className="icon-wrapper"> 
      <div className="icon icon-light" onClick={props?.onClick} /> 
    </div>
  )
}

export function IconCross(props: Props): ReactElement {
  return (
    <div className="icon-wrapper"> 
      <div className="icon icon-cross" onClick={props?.onClick} /> 
    </div>
  )
}
