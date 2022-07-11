import React, { useState } from 'react'

import { useSelector } from 'react-redux'
import { WithRouterProps } from 'react-router'
import { useEffectOnce } from 'react-use'

import { useLoadUserAndActiveTeam } from '@app/hooks/use-load-user-and-active-team'
import { useReduxDispatch } from '@app/hooks/use-redux-dispatch'
import getBrand from '@app/store_actions/brand'
import { AnimatedLoader } from 'components/AnimatedLoader'

interface Props {
  location: WithRouterProps['location']
  children: React.ReactElement<any>
}

function Authentication({ location, children }: Props) {
  // TODO: we must deprecate data object
  const data = useSelector(({ data }: { data: any }) => data)
  const { user, isLoading: isLoadingUser } = useLoadUserAndActiveTeam()
  const [isBrandLoading, setIsBrandLoading] = useState(true)
  const dispatch = useReduxDispatch()

  useEffectOnce(() => {
    const loadBrand = async () => {
      await dispatch(getBrand())

      setIsBrandLoading(false)
    }

    loadBrand()
  })

  if ((!user?.id && isLoadingUser) || isBrandLoading) {
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
