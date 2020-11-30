import React from 'react'
import { useSelector } from 'react-redux'

import { useLoadUser } from 'hooks/use-load-user'
import { AnimatedLoader } from 'components/AnimatedLoader'

function Authentication({ location, children }) {
  const data = useSelector(({ data }) => data)
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
