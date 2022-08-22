import { useState } from 'react'

import { Box, Button, Typography, makeStyles, Theme } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { FORM_ERROR } from 'final-form'
import { Form, Field } from 'react-final-form'
import { useDispatch } from 'react-redux'
import { WithRouterProps, Link } from 'react-router'

import { updateUser } from 'actions/user'
import { MUITextInput } from 'components/Forms/MUITextInput'
import { addNotification as notify } from 'components/notification'
import CircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'
import verify from 'models/verify/confirm'
import getVerificationCode from 'models/verify/request'
import { formatPhoneNumber } from 'utils/format'

import { useCommonStyles } from '../common-styles'
import Container from '../Container'
import Header from '../Header'
import NextButton from '../NextButton'
import SkipButton from '../SkipButton'
import { useDocumentTitle } from '../use-document-title'

const useStyles = makeStyles(
  (theme: Theme) => ({
    link: {
      ...theme.typography.button,
      color: theme.palette.secondary.main,
      margin: theme.spacing(0, 1),
      '&:hover': {
        color: theme.palette.secondary.dark
      }
    },
    helperLinksContainer: {
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.up('sm')]: {
        height: theme.spacing(6),
        flexDirection: 'row',
        alignItems: 'center'
      }
    }
  }),
  { name: 'VerifyPhoneNumber' }
)

interface FormValues {
  code: string | undefined
}

export function VerifyPhoneNumber(props: WithRouterProps) {
  useDocumentTitle('Verify Phone Number')

  const classes = useStyles()
  const commonClasses = useCommonStyles()
  const dispatch = useDispatch()
  const phoneNumber = window.decodeURIComponent(props.location.query.pn || '')
  const [isReSending, setIsReSending] = useState(false)

  const onSubmit = async (values: FormValues) => {
    try {
      const user = await verify({
        verifyType: 'phone',
        body: {
          code: values.code,
          phone_number: phoneNumber
        }
      })

      dispatch(updateUser(user))

      props.router.push('/onboarding/oauth-accounts')
    } catch (error) {
      if (error === 403) {
        return {
          [FORM_ERROR]: 'Invalid code.'
        }
      }

      return {
        [FORM_ERROR]: 'Something went wrong. Please try again.'
      }
    }
  }

  const handleReSendCode = async () => {
    try {
      setIsReSending(true)

      await getVerificationCode('phone')

      setIsReSending(false)
      dispatch(
        notify({
          status: 'success',
          message: 'A new 4-digit code has been texted to your mobile number.'
        })
      )
    } catch (errorCode) {
      setIsReSending(false)
      dispatch(
        notify({
          status: 'error',
          message:
            // eslint-disable-next-line max-len
            'Sorry, something went wrong while sending a new code. Please try again.',
          options: {
            dismissAfter: 6000
          }
        })
      )
    }
  }

  const validate = ({ code }: FormValues) => {
    code = code && code.trim()

    if (!code) {
      return { code: 'Required!' }
    }

    const isValidCode = new RegExp(/\d{4}$/).test(code)

    if (!isValidCode) {
      return { code: 'Invalid code.' }
    }

    return {}
  }

  return (
    <Container>
      <SkipButton to="/onboarding/oauth-accounts" />
      <Header
        title="Enter Code"
        subtitle={`We sent an activation code to ${formatPhoneNumber(
          phoneNumber
        )}, Please enter it here:`}
      />

      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit, form }) => {
          const { submitError, submitting } = form.getState()

          return (
            <form onSubmit={handleSubmit}>
              <Box mb={5}>
                <Box mb={5}>
                  <Field
                    component={MUITextInput}
                    id="code"
                    label="Verification Code"
                    placeholder="xxxx"
                    name="code"
                    variant="filled"
                    classes={{ root: commonClasses.field }}
                  />
                  {submitError && !submitting && (
                    <Box mt={3}>
                      <Alert severity="error">{submitError}</Alert>
                    </Box>
                  )}
                </Box>

                {submitting ? (
                  <CircleSpinner />
                ) : (
                  <NextButton type="submit" disabled={submitting} />
                )}
              </Box>
            </form>
          )
        }}
      />

      <Box className={classes.helperLinksContainer}>
        <Typography variant="button">Didn’t receive any message?</Typography>
        <Box display="flex" alignItems="center" height="3rem">
          <Link
            className={classes.link}
            to={`/onboarding/phone-number?pn=${window.encodeURIComponent(
              phoneNumber
            )}`}
          >
            Correct Phone Number
          </Link>
          <Typography variant="button">or</Typography>
          {isReSending ? (
            <CircleSpinner />
          ) : (
            <Button color="secondary" onClick={handleReSendCode}>
              resend the code
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  )
}
