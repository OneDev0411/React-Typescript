import React, { useState, useRef, useEffect } from 'react'

import {
  Box,
  Modal,
  Paper,
  Fade,
  Backdrop,
  makeStyles
} from '@material-ui/core'
import { FORM_ERROR } from 'final-form'
import { useDispatch } from 'react-redux'
import { browserHistory } from 'react-router'

import { updateUser } from 'actions/user'
import { upgradeAgent } from 'models/user/upgrade-to-agent'

import { MlsSelect } from './MlsSelect'
import { SecretQuestionForm } from './SecretQuestionForm'

const BACKDROP_TIMEOUT = 500

const useStyles = makeStyles(
  () => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    paper: {
      width: '600px',
      height: '400px',
      '&:focus': {
        outline: 'none'
      }
    }
  }),
  { name: 'SecretQuestionModal' }
)

interface Props {
  isOpen: boolean
  onHide: () => void
  agents: IAgent[]
  mlsId: string
}

export function SecretQuestionModal({ isOpen, onHide, agents, mlsId }: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const backdropTimeout = useRef<Nullable<ReturnType<typeof setTimeout>>>(null)
  const [selectedAgent, setSelectedAgent] = useState<IAgent | null>(null)

  useEffect(() => {
    return () => {
      if (backdropTimeout.current) {
        clearTimeout(backdropTimeout.current)
      }
    }
  }, [])

  const hide = () => {
    onHide()
    backdropTimeout.current = setTimeout(
      () => setSelectedAgent(null),
      BACKDROP_TIMEOUT
    )!
  }

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
      hide()
      browserHistory.push('/dashboard/account')
    } catch (error) {
      return {
        [FORM_ERROR]:
          error.response.body.message ||
          'There was an error with this request. Please try again.'
      }
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={onHide}
      className={classes.modal}
      aria-labelledby="agent-verification-modal-title"
      aria-describedby="agent-verification-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: BACKDROP_TIMEOUT
      }}
    >
      <Fade in={isOpen}>
        <Paper className={classes.paper}>
          <Box
            p={3}
            height="100%"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            {selectedAgent ? (
              <SecretQuestionForm
                agent={selectedAgent}
                onCancel={hide}
                onConfirm={onConfirm}
              />
            ) : (
              <MlsSelect
                agents={agents}
                mlsId={mlsId}
                onCancel={hide}
                onChange={onChangeSelectMls}
              />
            )}
          </Box>
        </Paper>
      </Fade>
    </Modal>
  )
}
