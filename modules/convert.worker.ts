import PxFilter, { StandardFilter } from './PixelFilter'

const ctx: Worker = self as any

ctx.addEventListener('message', (e: MessageEvent) => {
  const imageData = e.data[0]
  const type = e.data[1]
  let newImageData = imageData
  let scale = 1

  if (type === 'NoScale') {
    // this.outputData = this.inputData
    //
  } else if (e.data === 'invert') {
    newImageData = StandardFilter.invert(e.data[0])
    //
  } else if (type === 'grayscale') {
    newImageData = StandardFilter.grayScale(imageData)
    //
  } else if (type === 'binarization') {
    newImageData = StandardFilter.binarization(imageData, 127)
    //
  } else if (type === 'Epx') {
    scale = 2
    newImageData = PxFilter.EPX(imageData, 2)
    //
  } else if (type === 'Scale3x') {
    scale = 3
    newImageData = PxFilter.EPX(imageData, 3)
    //
  } else if (type === 'Scale4x') {
    scale = 4
    newImageData = PxFilter.EPX(imageData, 4)
    //
  } else if (type === 'EpxB') {
    scale = 2
    newImageData = PxFilter.SNES9x(imageData, 2, 'B')
    //
  } else if (type === 'EpxC') {
    scale = 2
    newImageData = PxFilter.SNES9x(imageData, 2, 'C')
    //
  } else if (type === 'Epx3') {
    scale = 3
    newImageData = PxFilter.SNES9x(imageData, 3, '3')
    //
  } else if (type === 'Eagle') {
    scale = 2
    newImageData = PxFilter.Eagle(imageData, 2)
    //
  } else if (type === 'Eagle3x') {
    scale = 3
    newImageData = PxFilter.Eagle(imageData, 3)
    //
  } else if (type === 'Eagle3xB') {
    scale = 3
    newImageData = PxFilter.Eagle(imageData, 3, 'B')
    //
  } else if (type === '2xSaI') {
    scale = 2
    newImageData = PxFilter._2xSaI(imageData, 2)
    //
  } else if (type === 'Super2xSaI') {
    scale = 2
    newImageData = PxFilter.Super2xSaI(imageData, 2)
    //
  } else if (type === 'SuperEagle') {
    scale = 2
    newImageData = PxFilter.SuperEagle(imageData, 2)
    //
  } else if (type === 'HQ2x') {
    scale = 2
    newImageData = PxFilter.HQx(imageData, 2)
    //
  } else if (type === 'HQ3x') {
    scale = 3
    newImageData = PxFilter.HQx(imageData, 3)
    //
  } else if (type === 'HQ4x') {
    scale = 4
    newImageData = PxFilter.HQx(imageData, 4)
    //
  } else if (type === 'XBR2x') {
    scale = 2
    newImageData = PxFilter.XBR(imageData, 2)
    //
  } else if (type === 'XBR3x') {
    scale = 3
    newImageData = PxFilter.XBR(imageData, 3)
    //
  } else if (type === 'XBR4x') {
    scale = 4
    newImageData = PxFilter.XBR(imageData, 4)
    //
  } else if (type === 'XBRz2x') {
    scale = 2
    newImageData = PxFilter.XBRz(imageData, 2)
    //
  } else if (type === 'XBRz3x') {
    scale = 3
    newImageData = PxFilter.XBRz(imageData, 3)
    //
  } else if (type === 'XBRz4x') {
    scale = 4
    newImageData = PxFilter.XBRz(imageData, 4)
    //
  } else if (type === 'XBRz5x') {
    scale = 5
    newImageData = PxFilter.XBRz(imageData, 5)
    //
  } else if (type === 'XBRz6x') {
    scale = 6
    newImageData = PxFilter.XBRz(imageData, 6)
    //
  } else if (type === '0') {
  }

  ctx.postMessage({ imageData: newImageData, scales: scale })
})
