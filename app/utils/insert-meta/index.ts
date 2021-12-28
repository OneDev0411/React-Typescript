interface Props {
  id?: string
  property: string
  name: string
  content: string
  placement?: 'top' | 'bottom'
}

// Insert meta tag element into the head of the document.
export function insertMeta({
  id,
  placement = 'bottom',
  property,
  name,
  content
}: RequireAtLeastOne<Props, 'name' | 'property'>) {
  const possibleId = id || name || property

  if (possibleId) {
    // Remove existing meta tags with the same data-id

    const existingMeta = document.querySelector(`meta[data-id="${possibleId}"]`)

    if (existingMeta) {
      existingMeta.remove()
    }
  }

  const meta = document.createElement('meta')

  if (possibleId) {
    meta.setAttribute('data-id', possibleId)
  }

  if (name) {
    meta.setAttribute('name', name)
  }

  if (property) {
    meta.setAttribute('value', property)
  }

  meta.setAttribute('content', content)

  const head = document.querySelector('head')

  head?.insertAdjacentElement(
    placement === 'top' ? 'afterbegin' : 'beforeend',
    meta
  )

  return meta
}
