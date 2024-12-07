import { ReactElement, useCallback, useContext } from "react"
import { Panel } from "src/components/Panel"
import { AppContext } from "src/state/context"
import { Divider } from "src/components/Divider"
import { Radio } from "src/components/Radio"

export function Colors(): ReactElement {
  return (
    <Panel label={"Colors"} icon="color">
    <Coloring />
    </Panel>
  )
}

function Coloring(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  
  const setColoring = useCallback((val: number) => {
    settingsDispatch({ type: "set", coloring: val })
  }, [settingsDispatch])
  
  const options = {
    0: 'Shaded',
    1: 'Simple',
    2: 'Grayscale',
    3: 'White',
    4: 'Black'
  }
  
  return (
    <div className="panel-section">
      <Divider label="Coloring" />
      <Radio options={options} onChange={setColoring} value={settings.coloring} />
    </div>
  )
}
