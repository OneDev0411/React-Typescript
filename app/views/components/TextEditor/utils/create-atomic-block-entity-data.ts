import { AtomicBlockEntityData } from '../types'

export function createAtomicBlockEntityData(
  element: HTMLElement
): AtomicBlockEntityData {
  const data: AtomicBlockEntityData = {
    ...getSizeEntityData(element),
    alignment: getAlignment(element)
  }

  if (element instanceof HTMLImageElement) {
    data.src = element.src
  }

  return data
}

function getSizeEntityData(element: HTMLElement) {
  const width = parseInt(element.style.width || '', 10) || undefined
  const height = parseInt(element.style.height || '', 10) || undefined

  return {
    width: width !== undefined ? `${width}` : width,
    height: height !== undefined ? `${height}` : height
  }
}

function getAlignment(
  element: HTMLElement
): AtomicBlockEntityData['alignment'] {
  if (element.style.cssFloat === 'left' || element.style.cssFloat === 'right') {
    return element.style.cssFloat
  }

  if (
    element.style.marginRight === 'auto' &&
    element.style.marginLeft === 'auto' &&
    element.style.display === 'block'
  ) {
    return 'center'
  }

  return 'default'
}
