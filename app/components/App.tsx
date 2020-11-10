import { makeStyles, Theme } from '@material-ui/core'

import React, { useEffect } from 'react'

import { useEffectOnce, useTitle } from 'react-use'

import { useSelector } from 'react-redux'

import { useUser } from 'hooks/use-load-user'
import { useReduxDispatch } from 'hooks/use-redux-dispatch'

import { AnimatedLoader } from 'components/AnimatedLoader'

import { setupGoogleAnalytics } from 'services/google-analytics'
import { setupFullStory } from 'services/fullstory'
import { setupSentry } from 'services/sentry'

import { IAppState } from 'reducers'

import getBrand from '../store_actions/brand'

import 'offline-js'

const useStyles = makeStyles(
  (theme: Theme) => ({
    loading: {
      background: theme.palette.grey[50],
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& svg': {
        width: '15%'
      }
    }
  }),
  {
    name: 'AppLayout'
  }
)

interface Props {
  children: React.ReactChildren
}

export default function App(props: Props) {
  const classes = useStyles()

  useTitle('Rechat')

  const brand = useSelector<IAppState, IBrand>(({ brand }) => brand)
  const { user, isLoading: isLoadingUser } = useUser()
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
    return (
      <div className={classes.loading}>
        <AnimatedLoader />
      </div>
    )
  }

  return props.children
}
