import { ReactElement, useCallback, useContext, useRef } from "react"
import { Panel } from "src/components/Panel"
import { useImgLoad } from "src/panels/hooks/img-load"
import { AppContext } from "src/state/context"
import { PASTEL_COLORS } from "src/utils/color"
import "./ImagePanel.css"

export function ImagePanel(): ReactElement {
  return (
    <Panel label="Image" icon="camera" color={PASTEL_COLORS.pancho}>
    <ImagePreview />
    </Panel>
  )
}

function ImagePreview(): ReactElement {
  const { image } = useContext(AppContext)
  const inputRef = useRef<HTMLInputElement>(null)
  const onClick = useCallback(() => {
    inputRef.current?.click()
  }, [])
  
  const onFile = useImgLoad()
  return (
    <div className="panel-section">
      <div className="file-input" onClick={onClick}>
        <img className="preview-image" src={image.image?.src} />
        <div className="file-icon" />
        <input ref={inputRef} type="file" onChange={onFile} accept="image/png, image/jpeg" />
      </div>
    </div> 
  )
}
