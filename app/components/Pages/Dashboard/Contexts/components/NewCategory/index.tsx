import React from 'react'

import { Box, Button, Divider } from '@material-ui/core'
import { Form } from 'react-final-form'

import { Modal, ModalHeader } from 'components/Modal'

import { AvailabilityFields } from './Fields/Availability'
import DetailsFiels from './Fields/Details'
import OptionFields from './Fields/Options'
import useStyles from './styles'

interface Props {
  isOpen: boolean
  brandPropertyTypes: IDealPropertyType[]
  brandId: UUID
  onClose: () => void
  onSubmit: (contextData: IDealBrandContext, contextId?: UUID) => Promise<any>
  context: IDealBrandContext | null
  section: string | null
}

function NewContextModal({
  isOpen,
  onClose,
  onSubmit,
  context,
  section,
  brandId,
  brandPropertyTypes
}: Props) {
  const classes = useStyles()
  const baseInitialValues: object = {
    data_type: 'Text',
    default_value: 0,
    section: section !== 'null' ? section : null
  }
  const initialValues: object = context
    ? { ...baseInitialValues, ...context }
    : baseInitialValues

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} autoHeight large>
      <ModalHeader
        closeHandler={onClose}
        title={context && context.label ? context.label : 'New Context'}
      />
      <Form
        onSubmit={(values: IDealBrandContext) => {
          if (context) {
            return onSubmit(values, context.id as UUID)
          }

          return onSubmit(values)
        }}
        initialValues={initialValues}
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
                  context={context}
                  brandId={brandId}
                  brandPropertyTypes={brandPropertyTypes}
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
