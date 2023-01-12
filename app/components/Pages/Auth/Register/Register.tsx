import { Box, Theme, makeStyles, Typography, Tooltip } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { FORM_ERROR } from 'final-form'
import { Form, Field } from 'react-final-form'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { useNavigate } from '@app/hooks/use-navigate'
import { useSearchParams } from '@app/hooks/use-search-param'
import { WithRouterProps } from '@app/routes/types'
import { MaskedInput } from '@app/views/components/MaskedInput'
import { PasswordTextField } from '@app/views/components/PasswordTextField'

import updatePassword from '../../../../models/auth/password/update'
import { editUser } from '../../../../models/user/edit'
import submitSigninForm from '../../../../store_actions/auth/signin'
import { updateUser } from '../../../../store_actions/user'
import NextButton from '../../../../views/components/OAuthFormNextButton'
import OAuthPageLayout from '../../../../views/components/OAuthPageLayout'
import CircleSpinner from '../../../../views/components/SvgIcons/CircleSpinner/IconCircleSpinner'

import { TextField } from './TextField'
import { FormValues } from './types'
import { UserTypeField } from './UserTypeField'
import { validate } from './validate'

const useStyles = makeStyles(
  (theme: Theme) => ({
    header: {
      marginBottom: theme.spacing(3)
    },
    link: {
      ...theme.typography.button,
      color: theme.palette.secondary.main,
      marginLeft: theme.spacing(0.5),
      '&:hover': {
        color: theme.palette.secondary.dark
      }
    }
  }),
  { name: 'RegisterForm' }
)

const useInputStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      width: '100%',
      marginBottom: theme.spacing(3),

      [theme.breakpoints.up(300)]: {
        width: 280
      },
      [theme.breakpoints.up('sm')]: {
        width: 400
      }
    }
  }),
  {
    name: 'RegisterForm-TextField'
  }
)

export function Register(props: WithRouterProps) {
  const classes = useStyles()
  const inputClasses = useInputStyles()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffectOnce(() => {
    if (!searchParams.get('token')) {
      navigate('/oops')
    }
  })

  const onSubmit = async (values: FormValues) => {
    const { first_name, last_name, email, password, phone_number, user_type } =
      values

    const token = searchParams.get('token')
    const redirectTo = searchParams.get('redirectTo')
    const phoneNumberFromUri = searchParams.get('phone_number')
    const emailFromURI = searchParams.get('email')

    const userPassword: {
      email?: string
      password: string
      shadow_token: Nullable<string>
      phone_number?: string
    } = {
      password,
      shadow_token: token
    }

    const userInfo: {
      email?: string
      last_name: string
      first_name: string
      phone_number?: string
      is_shadow: boolean
    } = {
      last_name,
      first_name,
      is_shadow: false
    }

    if (userInfo.phone_number) {
      userInfo.phone_number = phone_number
    }

    const loginInfo = {
      password,
      user_type,
      username: emailFromURI
    }

    if (phoneNumberFromUri) {
      userInfo.email = email
      userPassword.phone_number = phoneNumberFromUri
    } else if (emailFromURI) {
      userPassword.email = emailFromURI
    }

    try {
      await updatePassword(userPassword)

      if (user_type === 'Agent') {
        if (redirectTo) {
          window.localStorage.setItem('onboarding_redirectAtTheEnd', redirectTo)
        }

        const urlSearchParams = new URLSearchParams({
          ...searchParams,
          redirectTo: '/onboarding/confirm-agent-id'
        })

        navigate(
          {
            pathname: props.location.pathname,
            search: urlSearchParams.toString()
          },
          {
            state: props.location.state
          }
        )
      }

      await dispatch(submitSigninForm(loginInfo))

      const user = await editUser(userInfo)

      dispatch(updateUser(user))
    } catch (error) {
      return {
        [FORM_ERROR]: 'Something went wrong. Please try again.'
      }
    }
  }

  const getSignInUrl = () => {
    const username = searchParams.get('email') || ''
    const redirectTo = searchParams.get('redirectTo') || ''

    const queryString = new URLSearchParams({ username, redirectTo }).toString()

    return `/signin?${queryString}`
  }

  const getInitialValues = () => {
    let phoneNumber = searchParams.get('phone_number') || ''

    if (phoneNumber.startsWith('+1')) {
      phoneNumber = phoneNumber.substring(2)
    }

    const values: FormValues = {
      first_name: searchParams.get('first_name') || '',
      last_name: searchParams.get('last_name') || '',
      phone_number: phoneNumber,
      password: '',
      user_type: 'Agent'
    }

    if (!searchParams.get('phone_number')) {
      values.email = searchParams.get('email') || ''
    }

    return values
  }

  return (
    <OAuthPageLayout>
      <OAuthPageLayout.Header subtitle="Complete your registration" />
      <OAuthPageLayout.Main>
        <Form
          initialValues={getInitialValues()}
          onSubmit={onSubmit}
          validate={async (values: FormValues) => validate(values)}
          render={({ handleSubmit, form }) => {
            const { submitError, submitting } = form.getState()

            return (
              <form onSubmit={handleSubmit}>
                {searchParams.get('email') &&
                  !searchParams.get('phone_number') && (
                    <Tooltip
                      title="You have to sign up with this email you were invited with,
                          but once you are in the app, you can always go to your settings and
                          change your email to whatever you desire."
                    >
                      <TextField
                        name="email"
                        type="email"
                        label="Email Address"
                        InputProps={{
                          readOnly: true
                        }}
                        classes={inputClasses}
                      />
                    </Tooltip>
                  )}

                <TextField
                  name="first_name"
                  label="First Name"
                  classes={inputClasses}
                />

                <TextField
                  name="last_name"
                  label="Last Name"
                  classes={inputClasses}
                />

                {searchParams.get('phone_number') && (
                  <TextField
                    name="phone_number"
                    type="phone"
                    label="Phone Number"
                    InputProps={{
                      inputProps: {
                        mask: [
                          '(',
                          /[1-9]/,
                          /\d/,
                          /\d/,
                          ')',
                          ' ',
                          /\d/,
                          /\d/,
                          /\d/,
                          '-',
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/
                        ]
                      },
                      inputComponent: MaskedInput
                    }}
                    classes={inputClasses}
                  />
                )}

                <Field
                  name="password"
                  render={({ meta, input }) => (
                    <PasswordTextField
                      variant="filled"
                      label="Password"
                      classes={inputClasses}
                      error={Boolean(meta.submitFailed && meta.error)}
                      helperText={
                        meta.submitFailed && meta.error
                          ? meta.error || meta.submitError
                          : undefined
                      }
                      {...input}
                    />
                  )}
                />

                <UserTypeField />

                {submitError && !submitting && (
                  <Box py={3}>
                    <Alert severity="error">{submitError}</Alert>
                  </Box>
                )}

                {submitting ? (
                  <div>
                    <CircleSpinner />
                  </div>
                ) : (
                  <NextButton type="submit" disabled={submitting} />
                )}
              </form>
            )
          }}
        />

        <Box pt={4} pb={6} position="relative">
          <Typography color="textSecondary" variant="button">
            Already a member,
          </Typography>
          <Link className={classes.link} to={getSignInUrl()}>
            Sign in
          </Link>
          <OAuthPageLayout.PoweredBy />
        </Box>
      </OAuthPageLayout.Main>
    </OAuthPageLayout>
  )
}
