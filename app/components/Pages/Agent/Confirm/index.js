import React from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import compose from 'recompose/compose'
import { Field, reduxForm } from 'redux-form'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../controllers/Brand'
import searchAgent from '../../../../models/agent/search'
import { getBrandInfo, renderField } from '../../Auth/SignIn'

const AgentConfirm = ({
  mlsid,
  brand,
  setMlsid,
  redirectTo,
  confirmError,
  isSubmitting,
  onSubmitHandler,
  setConfirmError
}) => {
  const { siteLogo, siteTitle, brandColor } = getBrandInfo(brand)

  return (
    <div className="signin-page-wrapper c-auth--register clearfix">
      <div
        className="c-auth--register__houseIcon"
        style={{ paddingBottom: '6.5rem' }}
      >
        <img src="/static/images/signup/ntreis-logo.png" />
      </div>
      <article className="c-auth">
        <header className="c-auth__header" style={{ marginBottom: '4rem' }}>
          <Link to="/" tabIndex={-1}>
            <img
              src={siteLogo}
              alt={`${siteTitle} logo`}
              className={'c-auth__logo'}
            />
          </Link>
          <h1 className="c-auth__title tempo">
            {`${siteTitle}`}
          </h1>
          <p className="c-auth__subtitle">Register Agent</p>
          <div>
            <small>Enter your agent license # to unlock MLS features.</small>
          </div>
        </header>
        <main className="c-auth__main">
          <form onSubmit={onSubmitHandler}>
            <div
              style={{ marginBottom: '2rem' }}
              className="c-auth__field__input-wrapper"
            >
              <input
                autoFocus
                id={mlsid}
                type="text"
                name={mlsid}
                onChange={e => {
                  const newValue = e.target.value
                  setMlsid(newValue)
                  if (confirmError && newValue) {
                    setConfirmError(false)
                  }
                }}
                className={`c-auth__field__input ${!mlsid
                  ? ''
                  : 'has-content'}`}
              />
              <label htmlFor="mlsid" className="c-auth__field__label">
                Your Agent Number
              </label>
              <span className="focus-border">
                <i />
              </span>
            </div>
            {confirmError &&
              <div className="c-auth__submit-error-alert">
                {confirmError === 404
                  ? `Agent corresponding to this MLS ID (${mlsid}) not found!`
                  : 'There was an error with this request. Please try again.'}
              </div>}
            <button
              type="submit"
              className="c-auth__submit-btn"
              disabled={isSubmitting || !mlsid}
              style={{
                background: brandColor,
                opacity: isSubmitting || !mlsid ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
          <p style={{ textAlign: 'center' }}>
            <Link to={redirectTo}>I'll do this later</Link>
          </p>
        </main>
      </article>
    </div>
  )
}

export default compose(
  connect(({ brand }, { location }) => {
    const { redirectTo } = location.query
    return {
      brand,
      redirectTo: redirectTo || '/dashboard/mls'
    }
  }),
  withState('mlsid', 'setMlsid', ''),
  withState('confirmError', 'setConfirmError', false),
  withState('isSubmitting', 'setIsSubmitting', false),
  withHandlers({
    onSubmitHandler: ({
      mlsid,
      redirectTo,
      paramsFromURI,
      setConfirmError,
      setIsSubmitting
    }) => async event => {
      event.preventDefault()
      setIsSubmitting(true)
      try {
        const agent = await searchAgent(mlsid)
        setIsSubmitting(false)
      } catch (errorCode) {
        setIsSubmitting(false)
        setConfirmError(errorCode)
      }
    }
  })
)(AgentConfirm)
