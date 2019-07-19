export function getInputAnnotations(annotations) {
  const list = annotations.reduce(
    (current, page) => current.concat(page.inputs),
    []
  )

  return [].concat(list)
}
