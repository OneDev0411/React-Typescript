import { getAnnotations } from '../parse-annotations'

export async function unlinkAnnotations(
  document, // TODO: needs typing
  options: Record<string, any> // TODO: better typing reuqired
) {
  const { annotations } = await getAnnotations(document, options)

  return annotations
}
