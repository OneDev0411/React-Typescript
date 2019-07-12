import * as React from 'react'
import * as FinalForm from 'react-final-form'
import Flex from 'styled-flex-component'
import idx from 'idx/lib/idx'

import ActionButton from 'components/Button/ActionButton'
import LinkButton from 'components/Button/LinkButton'

import { TextInput } from 'components/Forms/TextInput'

import { Address } from './form-fields/Address'

import Field from '../components/CustomField'
import { Body, Footer, OfficeTitle } from '../styled'

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
      <Body>
        <OfficeTitle>
          Office info for {props.values.legal_full_name}
        </OfficeTitle>

        <Flex>
          <Field
            label="Office Name"
            name="office_name"
            initialValue={props.values.office_name || office.name}
            component={TextInput}
            style={{ flex: 4, marginRight: '0.5rem' }}
          />

          <Field
            label="Office Lisence Number"
            name="office_license_number"
            initialValue={
              props.values.office_license_number || office.license_number
            }
            component={TextInput}
            style={{ flex: 3, marginRight: '0.5rem' }}
          />

          <Field
            label="Office MLS ID"
            name="office_mls_id"
            initialValue={props.values.office_mls_id || office.mls_id}
            component={TextInput}
            style={{ flex: 3 }}
          />
        </Flex>

        <Flex style={{ marginTop: '1rem' }}>
          <Field
            label="Office Email"
            name="office_email"
            initialValue={props.values.office_email || office.email}
            component={TextInput}
            style={{ flex: 4, marginRight: '0.5rem' }}
          />

          <Field
            label="Office Phone"
            name="office_phone"
            initialValue={props.values.office_phone || office.phone}
            component={TextInput}
            style={{ flex: 3, marginRight: '0.5rem' }}
          />

          <Field
            label="Office Fax"
            name="office_fax"
            initialValue={props.values.office_fax || office.fax}
            component={TextInput}
            style={{ flex: 3 }}
          />
        </Flex>

        <Flex style={{ marginTop: '1rem' }}>
          <Field
            isVisible
            label="Office Address"
            name="office_address"
            initialValue={
              props.values.office_address || {
                full: office.address
              }
            }
            needsAddressForm
            component={Address}
            style={{ flex: 1 }}
          />
        </Flex>
      </Body>

      <Footer>
        <Flex alignCenter justifyEnd style={{ flex: 1 }}>
          <LinkButton type="button" onClick={props.onClose}>
            Cancel
          </LinkButton>

          <ActionButton
            size="small"
            appearance="primary"
            onClick={() => props.onSubmit(props.form, false)}
          >
            {props.isSubmitting ? 'Saving...' : 'Save'}
          </ActionButton>
        </Flex>
      </Footer>
    </>
  )
}
