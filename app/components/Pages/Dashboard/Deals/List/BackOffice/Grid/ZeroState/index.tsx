import { ZeroState } from 'partials/ZeroState'

export function ContactsZeroState() {
  return (
    <ZeroState
      imageUrl="/static/images/zero-state/contacts.png"
      title="You’ve done it. Inbox zero."
      // eslint-disable-next-line max-len
      subTitle="Sit back and relax. Get a coffee. We’ll notify you when a deal needs your
      attention."
    />
  )
}
