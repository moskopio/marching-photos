import { ReactElement, useCallback, useContext } from "react"
import { Divider } from "src/components/Divider"
import { Panel } from "src/components/Panel"
import { Radio } from "src/components/Radio"
import { Slider } from "src/components/Slider"
import { AppContext } from "src/state/context"
import { createPallette, PASTEL_COLORS } from "src/utils/pallette"

export function ShapePanel(): ReactElement {
  return (
    <Panel label="Shape" icon="shape" color={PASTEL_COLORS.givry} >
    <Position />
    <Samples />
    <Shape />
    </Panel>
  )
}

function Position(): ReactElement {
  const { camera, cameraDispatch } = useContext(AppContext)
  const pallette = createPallette(0)
  
  const setThetaRotation = useCallback((a: number) => { 
    cameraDispatch({ type: "set", rotation: { theta: a }})
  }, [cameraDispatch])
  
  const setPhiRotation = useCallback((a: number) => { 
    cameraDispatch({ type: "set", rotation: { phi: a }})
  }, [cameraDispatch])
  
  const setDolly = useCallback((dolly: number) => {
    cameraDispatch({ type: "set", dolly })
  }, [cameraDispatch])
  
  return (
    <div className="panel-section">
      <Divider label="Position" />
      <Slider
        label={`Theta: ${Math.floor(camera.rotation.theta)}°`}
        min={-180}
        max={180}
        onChange={setThetaRotation}
        value={camera.rotation.theta}
        defaultValue={0}
        color={pallette.getNextColor()}
      />
      <Slider
        label={`Phi: ${Math.floor(camera.rotation.phi)}°`}
        min={-180}
        max={180}
        onChange={setPhiRotation}
        value={camera.rotation.phi}
        defaultValue={0}
        color={pallette.getNextColor()}
      />
      <Slider
        label={`Dolly ${camera.dolly.toFixed(2)}`} 
        min={0}
        max={0.6}
        onChange={setDolly}
        defaultValue={0}
        value={camera.dolly}
        color={pallette.getNextColor()}
      />
    </div>
  )
}

function Samples(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  const pallette = createPallette(3)
  
  const setXSamples = useCallback((val: number) => {
    settingsDispatch({ type: "set", samples: [val, val] })
  }, [settingsDispatch])
  
  const setPush = useCallback((push: number) => {
    settingsDispatch({ type: "set", push })
  }, [settingsDispatch])
  
  
  return (
    <div className="panel-section">
      <Divider label="Samples" />
      <Slider
        label={`Samples: ${Math.floor(settings.samples[0])}`}
        min={4}
        max={512}
        onChange={setXSamples}
        value={settings.samples[0]}
        defaultValue={100}
        color={pallette.getNextColor()}
      />
      <Slider
        label={`Push: ${settings.push.toFixed(2)}`}
        min={0}
        max={0.5}
        onChange={setPush}
        value={settings.push}
        defaultValue={0.3}
        color={pallette.getNextColor()}
      />
    </div>
  )
}

function Shape(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  
  const setShape = useCallback((val: number) => {
    settingsDispatch({ type: "set", shape: val })
  }, [settingsDispatch])
  
  const options = {
    0: 'Sphere',
    1: 'Torus',
    2: 'Octahedron',
    3: 'Box'
  }
  
  return (
    <div className="panel-section">
      <Divider label="Shape" />
      <Radio options={options} onChange={setShape} value={settings.shape} />
    </div>
  )
}
