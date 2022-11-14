export function getTextAlignment(annotation: IFormAnnotation) {
  if (annotation.textAlignment === 1) {
    return 'center'
  }

  if (annotation.textAlignment === 2) {
    return 'right'
  }

  return 'left'
}
