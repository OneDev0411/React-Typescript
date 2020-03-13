import { uniq } from 'underscore'

export default function getRecipientNamesText(
  user: IUser,
  emailThread: IEmailThread<'contacts'>
): string {
  return (emailThread.senders_raw || [])
    .map(({ name, address }, index, all) => {
      const nameNotAddress = name === address ? '' : name
      const relatedContacts = emailThread.contacts
        ? emailThread.contacts
            .filter(c => c.email === address)
            .concat(
              emailThread.contacts.filter(
                c => c.emails && c.emails.includes(address)
              )
            )
        : []
      const allRelatedAddresses = uniq(
        relatedContacts
          .flatMap(({ email, emails }) =>
            emails ? [email, ...emails] : [email]
          )
          .concat(address)
      )
      const me = allRelatedAddresses.includes(user.email)
      const displayName =
        (all.length > 1 &&
          relatedContacts
            .map(({ first_name }) => first_name)
            .filter(name => name && !allRelatedAddresses.includes(name))[0]) ||
        relatedContacts
          .map(({ display_name }) => display_name)
          .filter(name => name && !allRelatedAddresses.includes(name))[0] ||
        nameNotAddress

      return me ? 'Me' : displayName || address
    })
    .join(', ')
}
