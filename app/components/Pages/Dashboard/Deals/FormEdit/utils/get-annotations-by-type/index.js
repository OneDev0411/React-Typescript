export function getAnnotationsByType(annotations, type) {
  const list = annotations.reduce(
    (current, page) => current.concat(getPageAnnotations(page, type)),
    []
  )

  return [].concat(list)
}

function getPageAnnotations(page, type) {
  return Object.entries(page[type]).reduce(
    (current, [, groups]) => current.concat(flattenGroups(groups)),
    []
  )
}

function flattenGroups(groups) {
  return Object.entries(groups).map(([, group]) => group)
}
