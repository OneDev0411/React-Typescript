import { CellWithMultipleValue } from './components/CellWithMultipleValue'

const MAX_LENGTH: number = 1

interface Props {
  contact: IContact
}

export function EmailsCell({ contact }: Props) {
  if (!contact.email) {
    return null
  }

  return (
    <CellWithMultipleValue
      label={contact.email}
      info={
        (contact.emails || []).length > MAX_LENGTH
          ? `${contact.emails?.length! - MAX_LENGTH} more`
          : undefined
      }
    />
  )
}
