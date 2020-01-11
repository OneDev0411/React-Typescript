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
  onSubmit?: (values: any) => void
  context: IDealBrandContext | null
}

function NewContextModal({ isOpen, onClose, onSubmit }: Props) {
  const classes = useStyles()
  const su = v => console.log(v)

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} autoHeight large>
      <ModalHeader closeHandler={onClose} title="New Context" />
      <Form
        onSubmit={su}
        render={({ handleSubmit, submitting }) => {
          return (
            <form onSubmit={handleSubmit} noValidate>
              <Box p={2}>
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
                    <Button type="submit" variant="contained" color="primary">
                      Save
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
