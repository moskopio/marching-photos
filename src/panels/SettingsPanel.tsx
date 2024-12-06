import { ReactElement, useCallback, useContext, useRef, useState } from "react"
import { Divider } from "src/components/Divider"
import { Panel } from "src/components/Panel"
import { Slider } from "src/components/Slider"
import { AppContext } from "src/state/context"
import { createPallette } from "src/utils/color"

export function SettingsPanel(): ReactElement {
  return (
    <Panel label="Settings" icon="settings">
    <Rotation />
    <Samples />
    <Position />
    </Panel>
  )
}

function Rotation(): ReactElement {
  const { camera, cameraDispatch } = useContext(AppContext)
  const pallette = createPallette(0)
  
  const setThetaRotation = useCallback((a: number) => { 
    cameraDispatch({ type: "set", rotation: { theta: a }})
  }, [cameraDispatch])
  
  const setPhiRotation = useCallback((a: number) => { 
    cameraDispatch({ type: "set", rotation: { phi: a }})
  }, [cameraDispatch])
  
  return (
    <div className="panel-section">
      <Divider label="Rotation" />
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
    </div>
  )
}

function Samples(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  const pallette = createPallette(2)
  const samplesRef = useRef(settings.samples)
  
  const setXSamples = useCallback((val: number) => {
    const samples = samplesRef.current
    samples[0] = val
    settingsDispatch({ type: "set", samples })
    samplesRef.current = samples
  }, [settingsDispatch])
  
  const setYSamples = useCallback((val: number) => {
    const samples = samplesRef.current
    samples[1] = val
    settingsDispatch({ type: "set", samples })
    samplesRef.current = samples
  }, [settingsDispatch])
  
  const setPush = useCallback((push: number) => {
    settingsDispatch({ type: "set", push })
  }, [settingsDispatch])
  
  
  return (
    <div className="panel-section">
      <Divider label="Samples" />
      <Slider
        label={`X: ${Math.floor(settings.samples[0])}`}
        min={6}
        max={1000}
        onChange={setXSamples}
        value={settings.samples[0]}
        defaultValue={100}
        color={pallette.getNextColor()}
      />
      <Slider
        label={`Y: ${Math.floor(settings.samples[1])}`}
        min={6}
        max={1000}
        onChange={setYSamples}
        value={settings.samples[1]}
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

function Position(): ReactElement {
  const { camera, cameraDispatch } = useContext(AppContext)
  const pallette = createPallette(2)
  
  const updateXTrack = useCallback((v: number) => {
    cameraDispatch({ type: "set", track: { x: v } })
  }, [cameraDispatch])
  
  const updateYTrack = useCallback((v: number) => {
    cameraDispatch({ type: "set", track: { y: v } })
  }, [cameraDispatch])
  
  const setDolly = useCallback((dolly: number) => {
    cameraDispatch({ type: "set", dolly })
  }, [cameraDispatch])
  
  return (
    <div className="panel-section">
      <Divider label="Position" />
      <Slider
        label={`Track X: ${camera.track.x.toFixed(2)}`} 
        min={-10}
        max={10}
        onChange={updateXTrack}
        defaultValue={0}
        value={camera.track.x}
        color={pallette.getNextColor()}
      />
      <Slider
        label={`Track Y: ${camera.track.y.toFixed(2)}`} 
        min={-10}
        max={10}
        onChange={updateYTrack}
        defaultValue={0}
        value={camera.track.y}
        color={pallette.getNextColor()}
      />
      <Slider
        label={`Dolly ${camera.dolly.toFixed(2)}`} 
        min={0}
        max={1}
        onChange={setDolly}
        defaultValue={0}
        value={camera.dolly}
        color={pallette.getNextColor()}
      />
    </div>
  )
}
