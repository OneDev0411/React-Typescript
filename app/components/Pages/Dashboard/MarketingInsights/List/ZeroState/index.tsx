import { ZeroState } from 'partials/ZeroState'

export function EmailInsightsZeroState() {
  return (
    <ZeroState
      imageUrl="/static/images/zero-state/insights.png"
      title="No insights to show, yet."
      subTitle={
        // eslint-disable-next-line max-len
        'Try sending your first campaign using "Create" button and clicking on "Email".'
      }
    />
  )
}
