import React from 'react'
import FinalForm from 'react-final-form'
import idx from 'idx/lib/idx'

import { Typography, Button, Box } from '@material-ui/core'

import { TextInput } from './form-fields/TextInput'
import { Address } from './form-fields/Address'

import Field from '../components/CustomField'

interface Props {
  initialValues: IDealRole
  values: IDealRole
  isSubmitting: boolean
  form: FinalForm.FormProps
  onClose: () => void
  onSubmit: (form: FinalForm.FormProps, saveContact: false) => void
}

export function OfficeForm(props: Props) {
  const office: IAgentOffice | StringMap<{}> =
    idx(props.initialValues, data => data.agent.office) || {}

  return (
    <>
      <Box>
        <Typography variant="h6">
          Office info for {props.values.legal_full_name}
        </Typography>

        <Box display="flex" my={2}>
          <Box flex={4} mr={1}>
            <Field
              label="Office Name"
              name="office_name"
              initialValue={props.values.office_name || office.name}
              component={TextInput}
            />
          </Box>

          <Box flex={3} mr={1}>
            <Field
              label="Office license Number"
              name="office_license_number"
              initialValue={
                props.values.office_license_number || office.license_number
              }
              component={TextInput}
            />
          </Box>

          <Box flex={3}>
            <Field
              label="Office MLS ID"
              name="office_mls_id"
              initialValue={props.values.office_mls_id || office.mls_id}
              component={TextInput}
            />
          </Box>
        </Box>

        <Box display="flex" my={2}>
          <Box flex={4} mr={1}>
            <Field
              label="Office Email"
              name="office_email"
              initialValue={props.values.office_email || office.email}
              component={TextInput}
            />
          </Box>

          <Box flex={3} mr={1}>
            <Field
              label="Office Phone"
              name="office_phone"
              initialValue={props.values.office_phone || office.phone}
              component={TextInput}
            />
          </Box>

          <Box flex={3}>
            <Field
              label="Office Fax"
              name="office_fax"
              initialValue={props.values.office_fax || office.fax}
              component={TextInput}
            />
          </Box>
        </Box>

        <Box my={2}>
          <Field
            isVisible
            label="Office Address"
            name="office_address"
            initialValue={
              props.values.office_address || {
                full: office.address
              }
            }
            component={Address}
          />
        </Box>
      </Box>

      <Box textAlign="right">
        <Button type="button" onClick={props.onClose}>
          Cancel
        </Button>

        <Button
          size="small"
          color="secondary"
          variant="contained"
          onClick={() => props.onSubmit(props.form, false)}
        >
          {props.isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </Box>
    </>
  )
}
