import { useContext, useEffect } from "react"
import { AppContext } from "src/state/context"

const EXPECTED_FILE_TYPES = ["image/jpeg", "image/png"]

export function useImgDrop(): void {
  const { imageDispatch } = useContext(AppContext)
  
  useEffect(() => {
    window.addEventListener("drop", fileDropHandler)
    window.addEventListener("dragover", onDragOver)
    
    function onDragOver(event: DragEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
    
    function fileDropHandler(event: DragEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      
      const items = event.dataTransfer?.items
      if (items && items.length > 0) {
      
        const file = items[0].getAsFile()
        if (file && EXPECTED_FILE_TYPES.includes(`${file?.type}`)) {
          const image = new Image()
          image.onload = (): void => imageDispatch({ image, name: file.name })
          image.src = URL.createObjectURL(file)
        }
      }
    }
    
  },[imageDispatch])
}
