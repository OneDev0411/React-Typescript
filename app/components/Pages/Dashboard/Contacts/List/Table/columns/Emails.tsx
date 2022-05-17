import { CellWithMultipleValue } from './components/CellWithMultipleValue'

const MAX_VALUES: number = 1

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
        (contact.emails || []).length > MAX_VALUES
          ? `${contact.emails?.length! - MAX_VALUES} more`
          : undefined
      }
    />
  )
}
