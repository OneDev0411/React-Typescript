import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Alert from '@material-ui/lab/Alert'

import { noop } from 'utils/helpers'
import { getActiveTeamId } from 'utils/user-teams'

import { addToFlow } from 'models/flows/add-to-flow'
import { getBrandFlows } from 'models/flows/get-brand-flows'

import { Container } from './styled'
import ListView from './ListView'
import DetailView from './DetailView'

AddToFlowForm.propTypes = {
  alignFrom: PropTypes.string,
  activeFlows: PropTypes.arrayOf(PropTypes.string.isRequired),
  contacts: PropTypes.shape().isRequired,
  callback: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  style: PropTypes.shape()
}

AddToFlowForm.defaultProps = {
  alignFrom: 'right',
  activeFlows: [],
  callback: noop,
  style: {}
}

function AddToFlowForm({ contacts, handleClose, callback, ...props }) {
  const [error, setError] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [templatesById, setTemplatesById] = useState({})
  const [selectedTemplateId, setSelectedTemplateId] = useState('')

  useEffect(() => {
    async function fetchTemplates() {
      try {
        setIsFetching(true)

        let templatesById = {}
        const data = await getBrandFlows(getActiveTeamId(props.user))

        data.forEach(t => {
          templatesById[t.id] = {
            ...t,
            isActive: props.activeFlows.includes(t.id)
          }
        })

        setTemplatesById(templatesById)
      } catch (error) {
        setError(error.message)
      } finally {
        setIsFetching(false)
      }
    }

    fetchTemplates()
  }, [props.activeFlows, props.user])

  const onSelectTemplate = useCallback(
    event => {
      event.persist()

      if (isAdding) {
        return false
      }

      const { id: selectedTemplateId } = event.currentTarget.dataset

      setSelectedTemplateId(selectedTemplateId)
    },
    [isAdding]
  )

  const addHandler = useCallback(
    async data => {
      if (isAdding) {
        return
      }

      try {
        setIsAdding(true)

        await addToFlow({
          ...data,
          contacts
        })

        setIsAdding(false)
        handleClose()
        callback()
      } catch (error) {
        const errorMessage = error.response?.body?.message || error.message

        setIsAdding(false)
        setError(errorMessage)
      }
    },
    [callback, contacts, handleClose, isAdding]
  )

  const closeHandler = useCallback(() => {
    if (isAdding) {
      return false
    }

    setError('')
    handleClose()
  }, [handleClose, isAdding])

  if (!props.isOpen) {
    return null
  }

  return (
    <>
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <Container depth={3} alignRight={props.alignFrom === 'right'}>
        <ListView
          flows={templatesById}
          isFetching={isFetching}
          onSelect={onSelectTemplate}
          selectedFlowId={selectedTemplateId}
        />
        <DetailView
          flow={templatesById[selectedTemplateId]}
          handleAdd={addHandler}
          handleClose={closeHandler}
          isAdding={isAdding}
        />
      </Container>
    </>
  )
}

export default connect(state => ({ user: state.user }))(AddToFlowForm)
