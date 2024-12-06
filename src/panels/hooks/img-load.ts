import { ChangeEvent, useCallback, useContext } from "react"
import { AppContext } from "src/state/context"

type ObjLoad = (event: ChangeEvent<HTMLInputElement>) => void

export function useImgLoad(): ObjLoad {
  const { imageDispatch } = useContext(AppContext)
  
  return useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0]
    
    if (file) {
      const image = new Image()
      image.src = URL.createObjectURL(file)
      imageDispatch({ image, name: file.name })
    }
  }, [])
}
