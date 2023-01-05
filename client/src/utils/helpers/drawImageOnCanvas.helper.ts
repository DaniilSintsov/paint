export function drawImageOnCanvas(
  canvas: HTMLCanvasElement,
  dataUrl: string
): void {
  const ctx = canvas.getContext('2d')
  const img: CanvasImageSource = new Image()
  img.src = dataUrl
  img.onload = () => {
    if (canvas.width && canvas.height) {
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
  }
}
