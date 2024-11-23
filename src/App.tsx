import { ReactNode } from "react"
import { WebGLPreview } from "src/preview/WebGLPreview"
import { AppContext, useAppState } from "src/state/context"
import { Panels } from "src/panels/Panels"


export function App(): ReactNode {
  const state = useAppState()

  return (
    <AppContext.Provider value={state}>
      <WebGLPreview />
      <Panels />
    </AppContext.Provider>
  )
}
