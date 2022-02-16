import { ZeroState } from 'partials/ZeroState'

interface Props {
  isSearching?: boolean
}

export function ContactsZeroState({ isSearching = false }: Props) {
  return (
    <ZeroState
      imageUrl={
        isSearching
          ? '/static/images/zero-state/agents-network.png'
          : '/static/images/zero-state/contacts.png'
      }
      title={isSearching ? 'No deals found' : 'You’ve done it. Inbox zero.'}
      subTitle={
        isSearching
          ? 'Try adjusting your search or create a new deal from scratch.'
          : 'Sit back and relax. Get a coffee. We’ll notify you when a deal needs your attention.'
      }
    />
  )
}
