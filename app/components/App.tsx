import { makeStyles, Theme } from '@material-ui/core'

import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useEffectOnce, useTitle } from 'react-use'

import { AnimatedLoader } from 'components/AnimatedLoader'
import { useUser } from 'hooks/use-load-user'

import getBrand from '../store_actions/brand'

const useStyles = makeStyles(
  (theme: Theme) => ({
    loading: {
      background: theme.palette.grey[50],
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& img': {
        width: '25%'
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

  const { user, isLoading: isLoadingUser } = useUser()
  const dispatch = useDispatch()

  useEffectOnce(() => {
    dispatch(getBrand())

    if (typeof window !== 'undefined') {
      // @ts-ignore
      import('offline-js')
    }
  })

  useEffect(() => {}, [user])

  if (!user && isLoadingUser) {
    return (
      <div className={classes.loading}>
        <img src="/static/images/logo.svg" alt="Rechat Loading" />
      </div>
    )
  }

  return props.children
}

// class App2 extends React.Component {
//   UNSAFE_componentWillMount() {
//     this.props.dispatch(getBrand())

//     if (typeof window !== 'undefined') {
//       import('offline-js')
//     }
//   }

//   componentDidMount() {
//     this.initializeApp()
//   }

//   async initializeApp() {
//     let { user, brand, dispatch } = this.props

//     if (user) {
//       if (!idx(user, user => user.teams[0].brand.roles)) {
//         user = {
//           ...user,
//           teams: await dispatch(getUserTeams(user))
//         }
//       }

//       // set user for full story
//       this.setFullStoryUser(user)

//       // set user data for sentry
//       this.setSentryUser(user, brand)
//     }

//     // google analytics
//     this.initialGoogleAnalytics(brand)
//   }

//   initialGoogleAnalytics(brand) {
//     if (!window) {
//       return
//     }

//     const analyticsId = Brand.asset(
//       'google_analytics_id',
//       'UA-56150904-2',
//       brand
//     )

//     const hostname = idx(brand, b => b.hostnames[0])
//       ? brand.hostnames[0]
//       : window.location.hostname

//     const page = window.location.pathname

//     ReactGA.initialize(analyticsId)
//     ReactGA.ga('create', analyticsId, 'auto', hostname)
//     ReactGA.set({ page })
//     ReactGA.pageview(page)
//   }

//   setFullStoryUser(user) {
//     if (window && window.FS) {
//       window.FS.identify(user.id, {
//         name: user.display_name,
//         email: user.email
//       })
//     }
//   }

//   setSentryUser(user, brand) {
//     Sentry.configureScope(scope => {
//       scope.setUser({
//         id: user.id,
//         email: user.email,
//         name: user.display_name,
//         brand: brand && {
//           id: brand.id,
//           name: brand.name
//         }
//       })
//     })
//   }

//   render() {
//     return (
//       <>
//         {/* <Helmet>
//           <title>Rechat</title>
//         </Helmet>
//         {this.props.children} */}
//       </>
//     )
//   }
// }

// function mapStateToProps(state) {
//   return {
//     user: state.user
//   }
// }

// export default connect(mapStateToProps)(App)
