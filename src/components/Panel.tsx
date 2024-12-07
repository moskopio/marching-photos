import { ReactElement, useCallback, useState } from "react"
import { IconCamera, IconColor, IconShape } from "./Icon"
import "./Panel.css"

interface Props {
  children: ReactElement | ReactElement[] | string
  icon:     string
  label:    string
  color:    string
}

export function Panel(props: Props): ReactElement {
  const [isExpanded, setIsExpanded] = useState(false)
  const onClick = useCallback(() => setIsExpanded(!isExpanded), [isExpanded, setIsExpanded])
  
  return isExpanded
    ? <ExtendedPanel onClick={onClick} {...props} />
    : <CollapsedPanel onClick={onClick} {...props} />
}

interface ClickableProps extends Props {
  onClick: () => void
}

function ExtendedPanel(props: ClickableProps): ReactElement {
  const {color, onClick, children, icon, label } = props
  const style = { background: color }
  
  return (
    <div className="panel">
      <div className="panel-content">
        <div className="panel-bar" onClick={onClick}>
          <div className="panel-bar-title">
            <PanelIcon icon={icon} />
            <div className="panel-top-divider" style={style} />
            <div className="panel-top-label">{label}</div>
          </div>
          <div className="panel-bar-close" onClick={onClick}/>
        </div>
        {children}
      </div>
    </div>
  )
}

function CollapsedPanel(props: ClickableProps): ReactElement {
  const { color, onClick, label, icon } = props
  const style = { background: color }
  
  return (
    <div className="panel-collapsed" onClick={onClick}>
      <PanelIcon icon={icon} />
      <div className="panel-top-divider" style={style}/>
      <div className="panel-top-label">{label}</div>
    </div>
  )
}


interface PanelIconProps {
  icon: string
}

function PanelIcon(props: PanelIconProps): ReactElement {
  const { icon } = props
  
  switch (icon) {
    case "camera":   return <IconCamera />
    case "color":    return <IconColor />
    case "shape":    return <IconShape />
    default:         return <IconCamera />
  }
  
}
