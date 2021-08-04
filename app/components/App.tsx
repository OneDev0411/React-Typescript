import React, { useEffect } from 'react'

import { useSelector } from 'react-redux'
import { useEffectOnce, useTitle } from 'react-use'

import { AnimatedLoader } from 'components/AnimatedLoader'
import { useLoadUser } from 'hooks/use-load-user'
import { useReduxDispatch } from 'hooks/use-redux-dispatch'
import { IAppState } from 'reducers'
import { setupFullStory } from 'services/fullstory'
import { setupGoogleAnalytics } from 'services/google-analytics'
import { setupSentry } from 'services/sentry'

import getBrand from '../store_actions/brand'

import 'offline-js'

interface Props {
  children: React.ReactChildren
}

export default function App(props: Props) {
  useTitle('Rechat')

  const brand = useSelector<IAppState, IBrand>(({ brand }) => brand)
  const { user, isGuest } = useLoadUser()
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

  if (!user?.id && !isGuest) {
    return <AnimatedLoader />
  }

  return props.children
}
