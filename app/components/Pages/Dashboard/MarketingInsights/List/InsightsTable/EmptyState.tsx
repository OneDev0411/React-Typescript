import { ZeroState } from 'partials/ZeroState'

interface Props {
  title?: string
  subTitle?: string
}

export function EmailInsightsZeroState({
  title = 'No insights to show, yet.',
  subTitle = 'Try sending your first campaign using "Create" button and clicking on "Email".'
}: Props) {
  return (
    <ZeroState
      imageUrl="/static/images/zero-state/insights.png"
      title={title}
      subTitle={subTitle}
    />
  )
}
