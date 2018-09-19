import React from 'react'
import { connect } from 'react-redux'

import compose from 'recompose/compose'

import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import searchAgent from '../../../../../models/agent/search'
import Button from '../../../../../views/components/Button/ActionButton'
import SecretQuestionModal from './components/SecretQuestionModal'
import PageHeader from '../../../../../views/components/PageHeader'

class AgentConfirm extends React.Component {
  onChange = e => {
    const newValue = e.target.value

    this.props.setMlsid(newValue)

    if (this.props.upgradeError && newValue) {
      this.props.setUpgradeError(false)
    }
  }

  render() {
    const {
      agent,
      mlsid,
      redirectTo,
      upgradeError,
      isUpgrading,
      onUpgradeHandler,
      onHideConfirmModal,
      confirmModalIsActive
    } = this.props

    return (
      <div>
        <PageHeader isFlat style={{ marginBottom: '1.5em' }}>
          <PageHeader.Title showBackButton={false}>
            <PageHeader.Heading>Upgrade Account1</PageHeader.Heading>
          </PageHeader.Title>
        </PageHeader>

        <div
          className="signin-page-wrapper c-auth--register clearfix"
          style={{
            borderRadius: '3px',
            paddingTop: '3em',
            paddingBottom: '2em',
            border: '1px solid #d4d4d4'
          }}
        >
          <article className="c-auth" style={{ background: 'inherit' }}>
            <header className="c-auth__header" style={{ marginBottom: '4rem' }}>
              <p className="c-auth__subtitle">
                <b>Upgrade to agent account</b>
              </p>
              <div>
                <small>
                  Enter your agent license # to unlock MLS features.
                </small>
              </div>
            </header>
            <main className="c-auth__main">
              <form onSubmit={onUpgradeHandler}>
                <div className="c-simple-field">
                  <label htmlFor="mlsid" className="c-simple-field__label">
                    Your Agent Number
                  </label>
                  <input
                    id="mlsid"
                    type="text"
                    onChange={this.onChange}
                    className="c-simple-field__input"
                  />
                </div>
                {upgradeError && (
                  <div className="c-auth__submit-error-alert">
                    {upgradeError === 404
                      ? `Agent corresponding to this MLS ID (${mlsid}) not found!`
                      : 'There was an error with this request. Please try again.'}
                  </div>
                )}
                <div style={{ textAlign: 'right' }}>
                  <Button type="submit" disabled={isUpgrading || !mlsid}>
                    {isUpgrading ? 'Searching...' : 'Upgrade'}
                  </Button>
                </div>
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
}

export default compose(
  connect(({ brand }, { location: { query } }) => {
    const { redirectTo } = query

    return {
      brand,
      redirectTo: redirectTo || '/dashboard/account'
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
