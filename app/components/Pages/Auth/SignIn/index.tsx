import { useState } from 'react'

import * as Sentry from '@sentry/react'
import { useSelector, useDispatch } from 'react-redux'

import { useNavigate } from '@app/hooks/use-navigate'
import { useSearchParams } from '@app/hooks/use-search-param'
import signin from '@app/models/auth/signin'
import signup from '@app/models/auth/signup'
import { getActiveTeam } from '@app/models/user/get-active-team'
import { logUserActivity } from '@app/models/user/log-activity'
import { lookUpUserByEmail } from '@app/models/user/lookup-user-by-email'
import { WithRouterProps } from '@app/routes/types'
import { withRouter } from '@app/routes/with-router'
import { setUserAndActiveTeam } from '@app/store_actions/active-team'
import { Logo } from '@app/views/components/OAuthPageLayout/Logo'
import { PoweredBy } from '@app/views/components/OAuthPageLayout/PoweredBy'

import { IAppState } from '../../../../reducers'
import { getUserDefaultHomepage } from '../../../../utils/get-default-home-page'

import LookUpUserForm from './LookupUserForm'
import SignInForm from './SiginForm'
import { SubmitMessage } from './types'

function Signin(props: WithRouterProps) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const brand = useSelector((state: IAppState) => state.brand)

  const [username, setUsername] = useState<string>(
    window.decodeURIComponent(searchParams.get('username') || '')
  )

  const redirectTo =
    props.location.state?.redirectTo || searchParams.get('redirectTo')

  const navigateTo = searchParams.get('navigateTo')

  const [isLookingUp, setIsLookingUp] = useState<boolean>(false)
  const [lookUpFormSubmitMsg, setLookUpFormSubmitMsg] =
    useState<SubmitMessage | null>(null)

  const [isLogging, setIsLogging] = useState<boolean>(false)
  const [signInFormSubmitMsg, setSignInFormSubmitMsg] =
    useState<SubmitMessage | null>(null)
  const [isHiddenLookUpForm, setIsHiddenLookUpForm] = useState<boolean>(false)

  const handleLookUp = async ({ username }) => {
    try {
      setIsLookingUp(true)
      setLookUpFormSubmitMsg(null)

      const response = await lookUpUserByEmail(username)

      if (response.sso_url) {
        window.location.replace(response.sso_url)
      } else {
        setUsername(username)

        if (response.is_shadow) {
          await signup(username)
          setLookUpFormSubmitMsg({
            type: 'info',
            // eslint-disable-next-line max-len
            text: "Your email already has been signed up in Rechat. But you didn't complete the registration. We resent a new activation email. Please check your inbox."
          })
        } else if (response.password) {
          setIsHiddenLookUpForm(true)
        }

        setIsLookingUp(false)
      }
    } catch (error) {
      setIsLookingUp(false)

      if (error?.response?.body) {
        setLookUpFormSubmitMsg({
          type: 'error',
          text: error.response.body.message
        })
      }
    }
  }

  const logUserLoginActivity = async () => {
    // Log user login activity
    try {
      await logUserActivity(
        {
          action: 'UserLoggedIn',
          object_class: 'UserActivityLogin',
          object: {
            type: 'user_activity_user_login'
          }
        },
        true
      )
    } catch (e) {
      console.log(e)
    }
  }

  const handleSignin = async values => {
    try {
      setIsLogging(true)
      setSignInFormSubmitMsg(null)

      const user: IUser = await signin({ ...values, username })
      const activeTeam: Nullable<IUserTeam> = await getActiveTeam(user)

      dispatch(setUserAndActiveTeam(user, activeTeam))

      Sentry.configureScope(scope => {
        scope.setUser({
          id: user.id,
          email: user.email,
          brand: brand && {
            id: brand.id,
            name: brand.name
          }
        })
      })

      await logUserLoginActivity()

      const defaultHomePage = getUserDefaultHomepage(activeTeam)

      // TO fix open house redirect issue
      // https://gitlab.com/rechat/web/-/issues/6917
      if (
        navigateTo &&
        typeof navigateTo === 'string' &&
        navigateTo.includes('http')
      ) {
        window.location.href = navigateTo

        return
      }

      navigate(redirectTo || defaultHomePage, { replace: true })
    } catch (errorCode) {
      if (errorCode === 403) {
        setSignInFormSubmitMsg({
          type: 'error',
          text: 'Invalid resource owner credentials!'
        })
      }

      setIsLogging(false)
    }
  }

  return (
    <div className="signin-page-wrapper">
      <article className="c-auth">
        <header className="c-auth__header">
          <a href="/" tabIndex={-1}>
            <Logo />
          </a>

          <h1 className="c-auth__title">
            {isHiddenLookUpForm ? 'Welcome' : 'Sign In'}
          </h1>
          <p className="c-auth__subtitle">
            {isHiddenLookUpForm ? username : 'Enter your Email to continue'}
          </p>
        </header>
        <main className="c-auth__main">
          {isHiddenLookUpForm ? (
            <SignInForm
              isLoading={isLogging}
              onSubmit={handleSignin}
              submitMessage={signInFormSubmitMsg}
              handleBackToLookupForm={() => {
                setIsHiddenLookUpForm(false)
                setSignInFormSubmitMsg(null)
              }}
              username={username}
            />
          ) : (
            <LookUpUserForm
              initialValues={{ username }}
              isLoading={isLookingUp}
              onSubmit={handleLookUp}
              submitMessage={lookUpFormSubmitMsg}
            />
          )}
        </main>
      </article>
      <PoweredBy />
    </div>
  )
}

export default withRouter(Signin)
