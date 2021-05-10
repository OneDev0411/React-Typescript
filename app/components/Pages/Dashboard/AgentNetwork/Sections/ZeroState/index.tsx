import { ZeroState } from 'partials/ZeroState'

export function AgentNetworksZeroState() {
  return (
    <ZeroState
      imageUrl="/static/images/zero-state/contacts.png"
      title="You don't have any listings."
      subTitle="Try searching for an address or listing at the top."
    />
  )
}
