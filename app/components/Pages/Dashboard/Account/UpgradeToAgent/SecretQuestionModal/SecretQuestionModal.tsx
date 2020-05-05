import React, { useState } from 'react'
import { browserHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import { FORM_ERROR } from 'final-form'
import { Box } from '@material-ui/core'

import { updateUser } from 'actions/user'
import { upgradeAgent } from 'models/user/upgrade-to-agent'

import Modal from 'components/BareModal'

import { MlsSelect } from './MlsSelect'
import { SecretQuestionForm } from './SecretQuestionForm'

interface Props {
  isOpen: boolean
  onHide: () => void
  agents: IAgent[]
  mlsId: string
}

export function SecretQuestionModal({ isOpen, onHide, agents, mlsId }: Props) {
  const dispatch = useDispatch()
  const [selectedAgent, setSelectedAgent] = useState<IAgent | null>(null)

  const onChangeSelectMls = event => {
    const selectedAgent = agents.find(agent => agent.id === event.target.value)

    if (selectedAgent) {
      setSelectedAgent(selectedAgent)
    }
  }

  const onConfirm = async (values: { secret: string }) => {
    if (!selectedAgent) {
      return
    }

    try {
      const user = await upgradeAgent({
        agent: selectedAgent.id,
        secret: values.secret
      })

      dispatch(updateUser(user))
      setSelectedAgent(null)
      onHide()
      browserHistory.push('/dashboard/account')
    } catch (error) {
      return {
        [FORM_ERROR]:
          error.response.body.message ||
          'There was an error with this request. Please try again.'
      }
    }
  }

  const onCancel = () => {
    setSelectedAgent(null)
    onHide()
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onHide}>
      <Box
        p={3}
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        {!selectedAgent && agents.length > 1 ? (
          <MlsSelect
            items={agents}
            mlsId={mlsId}
            onCancel={onCancel}
            onChange={onChangeSelectMls}
            defaultValue={agents[0]}
          />
        ) : (
          <SecretQuestionForm
            agent={selectedAgent}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        )}
      </Box>
    </Modal>
  )
}
