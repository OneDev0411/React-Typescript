import { Link } from '@material-ui/core'

import { useQueryParam } from '@app/hooks/use-query-param'
import { ZeroState, Props as ZeroStateProps } from 'partials/ZeroState'

import { SocialPostFilter } from './types'
import { useLoadAndFilterSocialPosts } from './use-load-and-filter-social-posts'

const mapFiltersToProps: Record<SocialPostFilter, ZeroStateProps> = {
  posted: {
    imageUrl: '/static/images/zero-state/insights.png',
    title: 'No Instagram posts yet',
    subTitle: (
      <>
        Start your first one by going to Marketing Center.{' '}
        <Link
          target="_blank"
          href="https://help.rechat.com/guides/marketing/social-marketing"
        >
          Find helpful tips here
        </Link>
      </>
    )
  },
  scheduled: {
    imageUrl: '/static/images/zero-state/insights.png',
    title: 'No scheduled Instagram posts yet',
    subTitle: (
      <>
        Schedule your first Instagram post by going to Marketing Center.{' '}
        <Link
          target="_blank"
          href="https://help.rechat.com/guides/marketing/social-marketing"
        >
          Learn more here
        </Link>
      </>
    )
  },
  failed: {
    imageUrl: '/static/images/zero-state/insights.png',
    title: "You don't have any failed Instagram posts yet",
    subTitle: (
      <>
        Having trouble?{' '}
        <Link
          target="_blank"
          href="https://help.rechat.com/guides/marketing/social-marketing"
        >
          Learn how to fix failed post
        </Link>
      </>
    )
  }
}

export function SocialPostZeroState() {
  const [filterRaw] = useQueryParam<SocialPostFilter>('filter', 'posted')

  const { filter } = useLoadAndFilterSocialPosts(filterRaw.trim())

  return <ZeroState {...mapFiltersToProps[filter]} />
}
