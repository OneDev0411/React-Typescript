import React from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import compose from 'recompose/compose'
import { Field, reduxForm } from 'redux-form'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../../controllers/Brand'
import searchAgent from '../../../../../models/agent/search'
import { getBrandInfo, renderField } from '../../../Auth/SignIn'
import SecretQuestionModal from './components/SecretQuestionModal'

const AgentConfirm = ({
  agent,
  mlsid,
  brand,
  setMlsid,
  redirectTo,
  upgradeError,
  isUpgrading,
  onUpgradeHandler,
  setUpgradeError,
  onHideConfirmModal,
  confirmModalIsActive
}) => {
  const { siteLogo, siteTitle, brandColor } = getBrandInfo(brand)
  return (
    <div className="signin-page-wrapper c-auth--register clearfix">
      <div
        className="c-auth--register__houseIcon"
        style={{ paddingBottom: '6.5rem' }}
      >
        <img
          src="/static/images/signup/ntreis-logo.png"
          alt="rechat ntreis logo"
        />
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
          <h1 className="c-auth__title tempo">{`${siteTitle}`}</h1>
          <p className="c-auth__subtitle">Upgrade to agent account</p>
          <div>
            <small>Enter your agent license # to unlock MLS features.</small>
          </div>
        </header>
        <main className="c-auth__main">
          <form onSubmit={onUpgradeHandler}>
            <div
              style={{ marginBottom: '2rem' }}
              className="c-auth__field__input-wrapper"
            >
              <input
                id="mlsid"
                type="text"
                onChange={e => {
                  const newValue = e.target.value
                  setMlsid(newValue)
                  if (upgradeError && newValue) {
                    setUpgradeError(false)
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
            {upgradeError && (
              <div className="c-auth__submit-error-alert">
                {upgradeError === 404 ? (
                  `Agent corresponding to this MLS ID (${mlsid}) not found!`
                ) : (
                  'There was an error with this request. Please try again.'
                )}
              </div>
            )}
            <button
              type="submit"
              className="c-auth__submit-btn"
              disabled={isUpgrading || !mlsid}
              style={{
                background: brandColor,
                opacity: isUpgrading || !mlsid ? 0.7 : 1
              }}
            >
              {isUpgrading ? 'Searching...' : 'Upgrade'}
            </button>
          </form>
          <p style={{ textAlign: 'center' }}>
            <Link to={redirectTo}>I'll do this later</Link>
          </p>
        </main>
      </article>
      {agent && (
        <SecretQuestionModal
          show={confirmModalIsActive}
          onHide={onHideConfirmModal}
          mlsid={mlsid}
          agent={agent.id}
          redirectTo={redirectTo}
          question={agent.secret_questions[0]}
        />
      )}
    </div>
  )
}

export default compose(
  connect(({ brand }, params) => {
    const { redirectTo } = params

    return {
      brand,
      redirectTo: redirectTo || '/dashboard/mls'
    }
  }),
  withState('agent', 'setAgent', ''),
  withState('mlsid', 'setMlsid', ''),
  withState('upgradeError', 'setUpgradeError', false),
  withState('isUpgrading', 'setIsUpgrading', false),
  withState('confirmModalIsActive', 'setConfirmModalActive', false),
  withHandlers({
    onHideConfirmModal: ({ setConfirmModalActive }) => () => {
      setConfirmModalActive(false)
    },
    onUpgradeHandler: ({
      mlsid,
      setAgent,
      setIsUpgrading,
      setUpgradeError,
      setConfirmModalActive
    }) => async event => {
      event.preventDefault()
      setIsUpgrading(true)
      try {
        const agent = await searchAgent(mlsid)
        setAgent(agent)
        setIsUpgrading(false)
        setConfirmModalActive(true)
      } catch (errorCode) {
        setIsUpgrading(false)
        setUpgradeError(errorCode)
      }
    }
  })
)(AgentConfirm)
