import React from 'react'
import { Form, Field } from 'react-final-form'
import { Grid, Box, Button, Divider } from '@material-ui/core'
import { TextField } from 'final-form-material-ui'

import { Modal, ModalHeader } from 'components/Modal'

import { validateStringInput } from '../helpers'
import { MAX_FLOW_NAME_LENGTH, MAX_FLOW_DESCRIPTION_LENGTH } from '../constants'

import { ContentContainer } from './styled'

interface Props {
  flow: IBrandFlow | null
  onClose: () => void
  onSubmit: (flow: IBrandFlowInput) => Promise<any>
}

export default function New({ flow, onClose, onSubmit }: Props) {
  function getModalTitle() {
    return flow ? 'Duplicate Flow' : 'Create Flow'
  }

  function getSubmitButtonTitle(submitting: boolean) {
    if (submitting) {
      if (flow) {
        return 'Duplicating...'
      }

      return 'Creating...'
    }

    if (flow) {
      return 'Duplicate'
    }

    return 'Create'
  }

  return (
    <Modal isOpen autoHeight onRequestClose={onClose}>
      <ModalHeader closeHandler={onClose} title={getModalTitle()} />
      <ContentContainer>
        <Form
          onSubmit={flowData => onSubmit(flowData as IBrandFlowInput)}
          initialValues={
            flow
              ? {
                  name: `Copy of ${flow.name}`,
                  description: flow.description
                    ? `Copy of ${flow.description}`
                    : ''
                }
              : {}
          }
          render={({ handleSubmit, submitting }) => {
            return (
              <form onSubmit={handleSubmit} noValidate>
                <Grid container>
                  <Grid item xs={12}>
                    <Box mb={3}>
                      <Field
                        autoFocus
                        validate={value =>
                          validateStringInput(
                            value,
                            'Flow name',
                            MAX_FLOW_NAME_LENGTH
                          )
                        }
                        name="name"
                        label="Name"
                        autoComplete="off"
                        fullWidth
                        required
                        component={TextField}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box mb={3}>
                      <Field
                        validate={value => {
                          if (value.length > MAX_FLOW_DESCRIPTION_LENGTH) {
                            return 'Invalid Flow description'
                          }
                        }}
                        name="description"
                        label="Description"
                        autoComplete="off"
                        fullWidth
                        component={TextField}
                      />
                    </Box>
                  </Grid>

                  <Divider />

                  <Grid container item xs={12} justify="flex-end">
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={submitting}
                    >
                      {getSubmitButtonTitle(submitting)}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )
          }}
        />
      </ContentContainer>
    </Modal>
  )
}
