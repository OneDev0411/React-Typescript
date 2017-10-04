import React from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import compose from 'recompose/compose'
import { Field, reduxForm } from 'redux-form'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import PageTitle from '../components/PageTitle'
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
    <div>
      <PageTitle title="Upgrade Account" />
      <div
        className="signin-page-wrapper c-auth--register clearfix"
        style={{ background: '#f0f4f7' }}
      >
        <article className="c-auth" style={{ background: 'inherit' }}>
          <header className="c-auth__header" style={{ marginBottom: '4rem' }}>
            <h1 className="c-auth__title din">{siteTitle}</h1>
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
    </div>
  )
}

export default compose(
  connect(({ brand }, { location: { query } }) => {
    const { redirectTo } = query
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
