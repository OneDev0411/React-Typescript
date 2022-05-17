import { CellWithMultipleValue } from './components/CellWithMultipleValue'

const MAX_TAGS: number = 2

interface Props {
  contact: IContact
}

export function TagsCell({ contact }: Props) {
  const tags = contact?.tags ?? []

  if (tags.length === 0) {
    return null
  }

  return (
    <CellWithMultipleValue
      label={tags.slice(0, MAX_TAGS).join(', ')}
      info={
        tags.length > MAX_TAGS ? `${tags.length - MAX_TAGS} more` : undefined
      }
    />
  )
}
