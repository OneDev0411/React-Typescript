import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  upsertContactAttributes,
  deleteAttributes
} from '../../../../../../../store_actions/contacts'
import { selectDefsBySection } from '../../../../../../../reducers/contacts/attributeDefs'
import { getContactAttributesBySection } from '../../../../../../../models/contacts/helpers'

import { FinalFormModal } from '../../../../../../../views/components/FinalFormModal'
import { Section } from '../Section'
import { orderFields, formatPreSave } from './helpers'

class SectionWithFields extends Component {
  state = {
    isOpen: false,
    isSaving: false
  }

  handleOpenModal = () => this.setState({ isOpen: true })
  handleCloseModal = () => {
    if (this.state.isSaving) {
      return
    }

    this.setState({ isOpen: false })
  }

  handleOnSubmit = async values => {
    try {
      this.setState({ isSaving: true })

      const { upsertedAttributeList, deletedAttributesList } = formatPreSave(
        this.props.fields,
        values
      )

      if (upsertedAttributeList.length > 0) {
        await this.props.upsertContactAttributes(
          this.props.contact.id,
          upsertedAttributeList
        )
      }

      if (deletedAttributesList.length > 0) {
        await this.props.deleteAttributes(
          this.props.contact.id,
          deletedAttributesList
        )
      }

      this.setState({ isSaving: false })
    } catch (error) {
      console.log(error)
    }
  }

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
          {orderedFields.map(field => {
            const value = field[field.attribute_def.data_type]

            if (!value) {
              return null
            }

            return [
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
                {value}
              </dd>
            ]
          })}
        </dl>

        <FinalFormModal
          fields={this.getModalFields()}
          isOpen={this.state.isOpen}
          onClose={this.handleCloseModal}
          submitting={this.state.isSaving}
          title="Edit Details"
          onSubmit={this.handleOnSubmit}
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
  { upsertContactAttributes, deleteAttributes }
)(SectionWithFields)
