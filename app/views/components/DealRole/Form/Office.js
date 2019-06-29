import React, { Fragment } from 'react'
import Flex from 'styled-flex-component'

import ActionButton from 'components/Button/ActionButton'
import LinkButton from 'components/Button/LinkButton'

import { TextInput } from 'components/Forms/TextInput'

import { Address } from './form-fields/Address'

import Field from '../components/CustomField'

import { Body, Footer, OfficeTitle } from '../styled'

export function OfficeForm(props) {
  return (
    <Fragment>
      <Body>
        <OfficeTitle>
          Office info for {props.values.legal_full_name}
        </OfficeTitle>

        <Flex>
          <Field
            label="Office Name"
            name="office_name"
            component={TextInput}
            style={{ flex: 4, marginRight: '0.5rem' }}
          />

          <Field
            label="Office Lisence Number"
            name="office_license_number"
            component={TextInput}
            style={{ flex: 3, marginRight: '0.5rem' }}
          />

          <Field
            label="Office MLS ID"
            name="office_mls_id"
            component={TextInput}
            style={{ flex: 3 }}
          />
        </Flex>

        <Flex style={{ marginTop: '1rem' }}>
          <Field
            label="Office Email"
            name="office_email"
            component={TextInput}
            style={{ flex: 4, marginRight: '0.5rem' }}
          />

          <Field
            label="Office Phone"
            name="office_phone"
            component={TextInput}
            style={{ flex: 3, marginRight: '0.5rem' }}
          />

          <Field
            label="Office Fax"
            name="office_fax"
            component={TextInput}
            style={{ flex: 3 }}
          />
        </Flex>

        <Flex style={{ marginTop: '1rem' }}>
          <Field
            isVisible
            label="Office Address"
            name="office_address"
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
    </Fragment>
  )
}
