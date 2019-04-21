import React, { Fragment } from 'react'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import TrashIcon from 'components/SvgIcons/TrashIcon/'

import IconButton from 'components/Button/IconButton'
import ActionButton from 'components/Button/ActionButton'
import LinkButton from 'components/Button/LinkButton'
import Tooltip from 'components/tooltip'

import { TextInput } from 'components/Forms/TextInput'

import { TitleInput } from './form-components/TitleInput'

import { Header, Body, Footer } from '../styled'

export function FormContainer(props) {
  const { role_type } = props.values

  return (
    <Fragment>
      <Header>***</Header>

      <Body>
        <Flex>
          <Field name="legal_prefix" component={TitleInput} />
          <Field
            name="legal_first_name"
            label="First Name"
            component={TextInput}
            style={{ marginRight: '0.5rem' }}
          />

          <Field
            name="legal_middle_name"
            label="Mid. Name"
            component={TextInput}
            style={{ width: '20%', marginRight: '0.5rem' }}
          />

          <Field
            name="legal_last_name"
            label="Last Name"
            component={TextInput}
          />
        </Flex>

        <Flex style={{ marginTop: '1rem' }}>
          <Field
            name="company"
            label="Company / Trust"
            component={TextInput}
            style={{ width: '80%', marginRight: '0.5rem' }}
          />

          <Field name="mls_id" label="MLS ID" component={TextInput} />
        </Flex>

        <Flex style={{ marginTop: '1rem' }}>
          <Field
            name="email"
            label="Email"
            component={TextInput}
            style={{ width: '50%', marginRight: '0.5rem' }}
          />

          <Field
            name="phone"
            label="Phone"
            component={TextInput}
            style={{ width: '50%' }}
          />
        </Flex>

        <Flex style={{ marginTop: '1rem' }}>
          <Field
            name="current_address"
            label="Current Address"
            component={TextInput}
            style={{ width: '50%', marginRight: '0.5rem' }}
          />

          <Field
            name="future_address"
            label="Future Address"
            component={TextInput}
            style={{ width: '50%' }}
          />
        </Flex>
      </Body>

      <Footer>
        <Flex>
          <Tooltip caption="Delete Role">
            <IconButton isFit iconSize="large" onClick={props.onDeleteRole}>
              <TrashIcon />
            </IconButton>
          </Tooltip>
        </Flex>

        <Flex>
          <LinkButton>Cancel</LinkButton>
          <ActionButton appearance="outline">Save</ActionButton>
          <ActionButton
            style={{
              marginLeft: '0.5rem'
            }}
          >
            Save & Add to My Contacts
          </ActionButton>
        </Flex>
      </Footer>
    </Fragment>
  )
}
