interface Props {
  contactAssociations?: ICRMTaskAssociation<'contact'>[]
}

export function ContactsCell({ contactAssociations }: Props) {
  const list = contactAssociations?.map(({ contact }) => contact?.display_name)

  return <div>{list?.join(', ')}</div>
}
