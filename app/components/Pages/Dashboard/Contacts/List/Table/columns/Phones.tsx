import { CellWithMultipleValue } from './components/CellWithMultipleValue'

const MAX_VALUES: number = 1

interface Props {
  contact: IContact
}

export function PhonesCell({ contact }: Props) {
  if (!contact.phone_number) {
    return null
  }

  return (
    <CellWithMultipleValue
      label={contact.phone_number}
      info={
        (contact.phone_numbers || []).length > MAX_VALUES
          ? `${contact.phone_numbers?.length! - MAX_VALUES} more`
          : undefined
      }
    />
  )
}
