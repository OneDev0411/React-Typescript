import React from 'react'
import { Form } from 'react-final-form'
import { Box, Button, Divider } from '@material-ui/core'

import { Modal, ModalHeader } from 'components/Modal'

import useStyles from './styles'
import DetailsFiels from './Fields/Details'
import OptionFields from './Fields/Options'
import AvailabilityFields from './Fields/Availability'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (contextData: IDealBrandContext) => Promise<any>
  context: IDealBrandContext | null
}

function NewContextModal({ isOpen, onClose, onSubmit, context }: Props) {
  const classes = useStyles()

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} autoHeight large>
      <ModalHeader
        closeHandler={onClose}
        title={context && context.label ? context.label : 'New Context'}
      />
      <Form
        onSubmit={values => onSubmit(values as IDealBrandContext)}
        initialValues={{ data_type: 'Text', default_value: 0, ...context }}
        render={({ handleSubmit, submitting }) => {
          return (
            <form onSubmit={handleSubmit} noValidate>
              <Box p={2} className={classes.modalContainer}>
                <DetailsFiels />
                <Box my={4}>
                  <Divider />
                </Box>
                <OptionFields />
                <Box my={4}>
                  <Divider />
                </Box>
                <AvailabilityFields
                  field_title="Mandatory in ..."
                  field_name="required"
                />
                <Box my={4}>
                  <Divider />
                </Box>
                <AvailabilityFields
                  field_title="Optional in ..."
                  field_name="optional"
                />
              </Box>
              <Box className={classes.modalFooter}>
                <Box className={classes.actions}>
                  <Box>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={submitting}
                    >
                      {!submitting ? 'Save' : 'Saving...'}
                    </Button>
                  </Box>
                  <Box mr={0.5}>
                    <Button onClick={onClose}>Close</Button>
                  </Box>
                </Box>
              </Box>
            </form>
          )
        }}
      />
    </Modal>
  )
}

export default NewContextModal
