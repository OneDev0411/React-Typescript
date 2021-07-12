import { searchContacts } from 'models/contacts/search-contacts'

import AutocompleteField, {
  BaseOption,
  AutocompleteFieldProps
} from '../AutocompleteField'

type ContactOption = BaseOption & IContact

export interface ContactAutocompleteFieldProps
  extends Omit<
    AutocompleteFieldProps<ContactOption>,
    'options' | 'noOptionsText'
  > {
  searchFieldValue: keyof IContact
  searchFieldLabel?: keyof IContact
}

function ContactAutocompleteField({
  searchFieldValue,
  searchFieldLabel = 'display_name',
  ...otherProps
}: ContactAutocompleteFieldProps) {
  const getOptions = async (value: string) => {
    if (!value || value.length < 3) {
      return []
    }

    const { data: contacts } = await searchContacts(value)

    return contacts
      .filter(contact => !!contact[searchFieldValue])
      .map((contact: IContact) => ({
        ...contact,
        value: (contact[searchFieldValue] || '') as string,
        label: (contact[searchFieldLabel] || '') as string
      }))
  }

  return (
    <AutocompleteField
      {...otherProps}
      options={getOptions}
      noOptionsText={loading =>
        loading ? 'Searching your contacts' : 'Type to search your contacts'
      }
    />
  )
}

export default ContactAutocompleteField
