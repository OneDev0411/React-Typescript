import React, { useEffect } from 'react'

import { useEffectOnce, useTitle } from 'react-use'

import { useSelector } from 'react-redux'

import { useLoadUser } from 'hooks/use-load-user'
import { useReduxDispatch } from 'hooks/use-redux-dispatch'

import { setupGoogleAnalytics } from 'services/google-analytics'
import { setupFullStory } from 'services/fullstory'
import { setupSentry } from 'services/sentry'

import { IAppState } from 'reducers'

import { AnimatedLoader } from 'components/AnimatedLoader'

import getBrand from '../store_actions/brand'

import 'offline-js'

interface Props {
  children: React.ReactChildren
}

export default function App(props: Props) {
  useTitle('Rechat')

  const brand = useSelector<IAppState, IBrand>(({ brand }) => brand)
  const { user, isLoading: isLoadingUser } = useLoadUser()
  const dispatch = useReduxDispatch()

  useEffectOnce(() => {
    const loadBrand = async () => {
      const brand: IBrand = await dispatch(getBrand())

      setupGoogleAnalytics(brand)
    }

    loadBrand()
  })

  useEffect(() => {
    if (!user) {
      return
    }

    setupFullStory(user)
    setupSentry(user, brand)
  }, [user, brand])

  if (!user?.id && isLoadingUser) {
    return <AnimatedLoader />
  }

  return props.children
}
