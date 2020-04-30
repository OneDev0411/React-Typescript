import React, { useState } from 'react'
import { WithRouterProps, Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { FORM_ERROR } from 'final-form'
import { Form, Field } from 'react-final-form'
import { addNotification as notify } from 'reapop'
import { Box, Button, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { makeStyles, Theme } from '@material-ui/core'

import { formatPhoneNumber } from 'utils/format'

import { IAppState } from 'reducers'
import { updateUser } from 'actions/user'

import getVerificationCode from 'models/verify/request'
import verify from 'models/verify/confirm'

import { MUITextInput } from 'components/Forms/MUITextInput'
import CircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import Header from '../Header'
import SkipButton from '../SkipButton'
import NextButton from '../NextButton'
import Container from '../Container'
import { useCommonStyles } from '../common-styles'
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
  const brand = useSelector((store: IAppState) => store.brand)
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
            'Sorry, something went wrong while sending a new code. Please try again.',
          dismissAfter: 6000
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
      <Header
        brand={brand}
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
                  <Box display="flex" justifyContent="center">
                    <SkipButton to="/onboarding/oauth-accounts" />
                    <NextButton type="submit" disabled={submitting} />
                  </Box>
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
