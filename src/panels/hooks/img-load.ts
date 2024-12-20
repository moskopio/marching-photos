import { ChangeEvent, useCallback, useContext } from "react"
import { AppContext } from "src/state/context"

type ImgLoad = (event: ChangeEvent<HTMLInputElement>) => void

export function useImgLoad(): ImgLoad {
  const { imageDispatch } = useContext(AppContext)
  
  return useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0]
    
    if (file) {
      const image = new Image()
      image.onload = (): void => imageDispatch({ image, name: file.name })
      image.src = URL.createObjectURL(file)
    }
  }, [imageDispatch])
}
