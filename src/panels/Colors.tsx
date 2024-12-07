import { ReactElement, useCallback, useContext } from "react"
import { Panel } from "src/components/Panel"
import { AppContext } from "src/state/context"
import { Divider } from "src/components/Divider"
import { Radio } from "src/components/Radio"
import { createPallette, PASTEL_COLORS } from "src/utils/pallette"
import { Checkbox } from "src/components/Checkbox"

export function Colors(): ReactElement {
  return (
    <Panel label={"Colors"} icon="color" color={PASTEL_COLORS.lynch} >
      <Coloring />
      <Settings />
    </Panel>
  )
}

function Coloring(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  
  const options = { 0: 'Image', 1: 'Grayscale', 2: 'White', 3: 'Black' }
  
  const setColoring = useCallback((val: number) => {
    settingsDispatch({ coloring: val })
  }, [settingsDispatch])
  
  return (
    <div className="panel-section">
      <Divider label="Coloring" />
      <Radio options={options} onChange={setColoring} value={settings.coloring} />
    </div>
  )
}

function Settings(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  const pallette = createPallette(4)
  
  const setShadingDisabled = useCallback((shadingDisabled: boolean) => {
    settingsDispatch({ advanced: { shadingDisabled } })
  }, [settingsDispatch])
  
  const setColorReversed = useCallback((colorReversed: boolean) => {
    settingsDispatch({ advanced: { colorReversed } })
  }, [settingsDispatch])
  
  
  return (
    <div className="panel-section">
      <Checkbox
        color={pallette.getNextColor()}
        label="Disable Shading"
        onChange={setShadingDisabled}
        value={settings.advanced.shadingDisabled}
      />
      <Checkbox
        color={pallette.getNextColor()}
        label="Reverse colors"
        onChange={setColorReversed}
        value={settings.advanced.colorReversed}
      />
    </div>
  )
}
