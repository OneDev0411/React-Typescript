import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Button } from '@material-ui/core'

import { IAppState } from 'reducers'
import searchAgent from 'models/agent/search'

import SecretQuestionModal from '../../Dashboard/Account/Upgrade/components/SecretQuestionModal'

import Header from '../Header'
import Container from '../Container'

export default function ConfirmAgentId(props) {
  const brand = useSelector((store: IAppState) => store.brand)
  const redirectTo: string =
    props.location.query.redirectTo || '/dashboard/account'
  const [agent, setAgent] = useState<IAgent | null>(null)
  const [mlsid, setMlsid] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmModalIsActive, setConfirmModalActive] = useState(false)

  const onChange = e => {
    const newValue = e.target.value

    setMlsid(newValue)

    if (error && newValue) {
      setError('')
    }
  }

  const onHideConfirmModal = () => {
    setConfirmModalActive(false)
  }

  const onUpgradeHandler = async event => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const agent = await searchAgent(mlsid)

      setAgent(agent)
      setIsSubmitting(false)
      setConfirmModalActive(true)
    } catch (errorCode) {
      setIsSubmitting(false)

      if (errorCode === 404) {
        setError(`Agent corresponding to this MLS ID (${mlsid}) not found!`)
      } else {
        setError('There was an error with this request. Please try again.')
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Confirm Agent ID | Rechat</title>
      </Helmet>

      <Container>
        <Header
          brand={brand}
          title="Confirm your license"
          subtitle="Enter your agent license # to unlock MLS features."
        />

        <form onSubmit={onUpgradeHandler}>
          <div className="c-simple-field">
            <div className="c-simple-field__label">Your Agent Number</div>
            <input
              id="mlsid"
              type="text"
              name="mlsid"
              onChange={onChange}
              className="c-simple-field__input"
              style={{ width: '360px' }}
            />
          </div>

          {error && <div className="c-auth__submit-error-alert">{error}</div>}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || !mlsid}
          >
            {isSubmitting ? 'Submiting...' : 'Submit'}
          </Button>
        </form>
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
      </Container>
    </>
  )
}
