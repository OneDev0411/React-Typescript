import React, { Component } from 'react'
import { connect } from 'react-redux'

import { upsertContactAttributes } from '../../../../../../../store_actions/contacts'
import { selectDefsBySection } from '../../../../../../../reducers/contacts/attributeDefs'
import { getContactAttributesBySection } from '../../../../../../../models/contacts/helpers'

import { FinalFormModal } from '../../../../../../../views/components/FinalFormModal'
import { Section } from '../Section'
import { orderFields } from './helpers/order-fields'

class SectionWithFields extends Component {
  state = {
    isOpen: false,
    isSaving: false
  }

  upsertAttribute = async attribute => {
    const { contact, upsertContactAttributes } = this.props

    this.setState(
      {
        isSaving: true
      },
      async () => {
        try {
          await upsertContactAttributes(contact.id, [attribute])
        } catch (error) {
          throw error
        } finally {
          this.setState({
            isSaving: false
          })
        }
      }
    )
  }

  handleOpenModal = () => this.setState({ isOpen: true })
  handleCloseModal = () => this.setState({ isOpen: false })

  getModalFields = () => {
    const emptyFields = this.props.sectionAttributesDef
      .filter(
        attribute_def =>
          !this.props.fields.some(
            field => field.attribute_def.name === attribute_def.name
          )
      )
      .map(attribute_def => ({
        attribute_def,
        id: undefined,
        [attribute_def.data_type]: ''
      }))

    return orderFields(
      [...this.props.fields, ...emptyFields],
      this.props.fieldsOrder
    )
  }

  render() {
    const orderedFields = orderFields(this.props.fields, this.props.fieldsOrder)

    return (
      <Section
        title={`Edit ${this.props.section}`}
        onEdit={this.handleOpenModal}
      >
        <dl style={{ marginBottom: '1em' }}>
          {orderedFields.map(field => [
            <dt
              key={`${field.id}_title`}
              style={{
                color: '#758a9e',
                fontWeight: '500',
                marginBottom: '0.25em'
              }}
            >
              {field.attribute_def.label}
            </dt>,
            <dd
              key={`${field.id}_value`}
              style={{ color: '#17283a', marginBottom: '1em' }}
            >
              {field[field.attribute_def.data_type]}
            </dd>
          ])}
        </dl>

        <FinalFormModal
          fields={this.getModalFields()}
          isOpen={this.state.isOpen}
          onClose={this.handleCloseModal}
          submitting={this.state.isSaving}
          title="Edit Contact Details"
          onSubmit={values => {
            console.log(values)
          }}
        />
      </Section>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    attributeDefs: state.contacts.attribute_def,
    fields: getContactAttributesBySection(props.contact, props.section),
    sectionAttributesDef: selectDefsBySection(
      state.contacts.attributeDefs,
      props.section
    )
  }
}

export default connect(
  mapStateToProps,
  {
    upsertContactAttributes
  }
)(SectionWithFields)
