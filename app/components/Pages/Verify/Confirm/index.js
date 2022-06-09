import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import lifecycle from 'recompose/lifecycle'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'

import { Logo } from '@app/views/components/OAuthPageLayout/Logo'
import { PoweredBy } from '@app/views/components/OAuthPageLayout/PoweredBy'

import verify from '../../../../models/verify'
import { updateUser } from '../../../../store_actions/user'
import { Spinner } from '../../../Partials/Loading'
import Alert from '../../Dashboard/Partials/Alert'

const ERROR_MESSAGE =
  // eslint-disable-next-line max-len
  "You have encountered an unknown system issue. We're working on it. In the meantime, connect with our support."

const ConfirmVerify = ({
  verifyType,
  userMessage,
  isSubmitting,
  verifyQueryParams
}) => {
  return (
    <div className="signin-page-wrapper">
      <article className="c-auth">
        <header className="c-auth__header" style={{ marginBottom: '4rem' }}>
          <Link to="/" tabIndex={-1}>
            <Logo />
          </Link>
          <p className="c-auth__subticonfirmtle">Verification for</p>
          <p>
            {
              verifyQueryParams.body[
                verifyType === 'phone' ? 'phone_number' : 'email'
              ]
            }
          </p>
        </header>
        <main className="c-auth__main">
          {isSubmitting && <Spinner />}

          {userMessage && (
            <div>
              <Alert {...userMessage} style={{ marginBottom: '1rem' }}>
                {userMessage.text}
              </Alert>
              <div style={{ textAlign: 'center' }}>
                <Link to="/dashboard/mls">go to the dashboard</Link>
              </div>
            </div>
          )}
        </main>
      </article>
      <PoweredBy />
    </div>
  )
}

export default compose(
  connect(
    ({ brand }, { location: { query }, params: { verifyType } }) => {
      const { email, email_code, phone_code, phone_number } = query

      const verifyQueryParams = {
        verifyType
      }

      if (verifyType === 'email') {
        verifyQueryParams.body = {
          email,
          email_code
        }
      }

      if (verifyType === 'phone') {
        verifyQueryParams.body = {
          phone_number,
          code: phone_code
        }
      }

      return {
        brand,
        verifyType,
        verifyQueryParams
      }
    },
    { updateUser }
  ),
  withState('userMessage', 'setUserMessage', null),
  withState('isSubmitting', 'setIsSubmitting', true),
  withHandlers({
    verifyRequestHandler:
      ({ verifyType, setUserMessage, setIsSubmitting, verifyQueryParams }) =>
      () => {
        setUserMessage(null)

        const to =
          verifyType === 'email'
            ? verifyQueryParams.body.email
            : verifyQueryParams.body.phone_number

        verify
          .request(verifyType)
          .then(() => {
            setIsSubmitting(false)
            setUserMessage({
              type: 'success',
              // eslint-disable-next-line max-len
              text: `Your previous activation code has expired. We\'ve sent a new verification link to ${to}.`
            })
          })
          .catch(errorCode => {
            setIsSubmitting(false)
            setUserMessage({
              code: errorCode,
              type: 'error',
              text: ERROR_MESSAGE
            })
          })
      }
  }),
  withHandlers({
    confirmHandler:
      ({
        updateUser,
        verifyType,
        verifyQueryParams,
        setUserMessage,
        setIsSubmitting,
        verifyRequestHandler
      }) =>
      () => {
        setUserMessage(null)

        verify
          .confirm(verifyQueryParams)
          .then(user => {
            updateUser(user)
            setIsSubmitting(false)
            setUserMessage({
              type: 'success',
              text: `${
                verifyType === 'email' ? 'Email' : 'Phone number'
              } is verified.`
            })
          })
          .catch(errorCode => {
            if (errorCode === 403) {
              verifyRequestHandler()

              return
            }

            setIsSubmitting(false)
            setUserMessage({
              code: errorCode,
              type: 'error',
              text: ERROR_MESSAGE
            })
          })
      }
  }),
  lifecycle({
    componentDidMount() {
      const { confirmHandler } = this.props

      confirmHandler()
    }
  })
)(ConfirmVerify)
