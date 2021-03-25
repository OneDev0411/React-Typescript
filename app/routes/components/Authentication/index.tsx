import React from 'react'
import { useSelector } from 'react-redux'
import { WithRouterProps } from 'react-router'

import { useLoadUser } from 'hooks/use-load-user'
import { AnimatedLoader } from 'components/AnimatedLoader'

interface Props {
  location: WithRouterProps['location']
  children: React.ReactElement<any>
}

function Authentication({ location, children }: Props) {
  // TODO: we must deprecate data object
  const data = useSelector(({ data }: { data: any }) => data)
  const { user, isLoading: isLoadingUser } = useLoadUser()

  if (!user?.id && isLoadingUser) {
    return <AnimatedLoader />
  }

  const elements = React.cloneElement(children, {
    data: {
      ...data,
      user,
      location,
      path: location.pathname
    },
    user,
    location
  })

  return <div>{elements}</div>
}

export default Authentication
