import { Field, Form } from 'react-final-form'

import Flex, { FlexItem } from 'styled-flex-component'

import * as React from 'react'

import { Modal, ModalHeader } from 'components/Modal/index'
import { TextInput } from 'components/Forms/TextInput'
import { SelectInput } from 'components/Forms/SelectInput'

import Button from 'components/Button/ActionButton'

import { BrandTypes, IAddEditTeamFormData } from 'models/BrandConsole'

interface Props {
  close: () => void
  submit: (values: Partial<IBrand> & IAddEditTeamFormData) => void
  validate: (
    values: IAddEditTeamFormData
  ) => { [fieldName: string]: string | undefined }
  isOpen: boolean
  team: IBrand | null
}

export function AddEditTeamModal(props: Props) {
  return (
    <Modal
      style={{ content: { overflow: 'visible' } }}
      isOpen={props.isOpen}
      onRequestClose={props.close}
      autoHeight
    >
      <ModalHeader
        closeHandler={props.close}
        title={props.team ? 'Edit team' : 'Add team'}
      />
      <Form
        onSubmit={props.submit}
        validate={props.validate}
        initialValues={props.team || { brand_type: BrandTypes.Team }}
        render={({ handleSubmit, submitting }) => (
          <form
            onSubmit={handleSubmit}
            style={{ padding: '1.5rem' }}
            noValidate
          >
            <Flex>
              <FlexItem grow={1} basis="0%" style={{ paddingRight: '0.75rem' }}>
                <Field
                  autoFocus
                  name="name"
                  label="Title"
                  required
                  component={TextInput as any}
                />
              </FlexItem>
              <FlexItem grow={1} basis="0%">
                <Field
                  name="brand_type"
                  items={Object.values(BrandTypes).map(value => ({
                    label: value,
                    value
                  }))}
                  dropdownOptions={{
                    fullWidth: true,
                    fullHeight: true
                  }}
                  label="Type"
                  component={SelectInput as any}
                />
              </FlexItem>
            </Flex>
            <Flex>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save'}
              </Button>
            </Flex>
          </form>
        )}
      />
    </Modal>
  )
}
