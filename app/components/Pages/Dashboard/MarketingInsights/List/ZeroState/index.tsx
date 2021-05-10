import { ZeroState } from 'partials/ZeroState'

export function EmailInsightsZeroState() {
  return (
    <ZeroState
      imageUrl="/static/images/zero-state/contacts.png"
      title="No insights to show, yet."
      subTitle={
        'Try sending your first campaign using "Create" button and clicking on "Email".'
      }
    />
  )
}
