import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  upsertContactAttributes,
  deleteAttributes
} from '../../../../../../../store_actions/contacts'
import { selectDefsBySection } from '../../../../../../../reducers/contacts/attributeDefs'
import { getContactAttributesBySection } from '../../../../../../../models/contacts/helpers'
import ActionButton from '../../../../../../../views/components/Button/ActionButton'

import { EditForm } from './EditFormDrawer'
import { Section } from '../Section'
import { orderFields, formatPreSave, getFormater } from './helpers'

const propTypes = {
  addNewFieldButtonText: PropTypes.string,
  showAddNewCustomAttributeButton: PropTypes.bool
}

const defaultProps = {
  addNewFieldButtonText: '',
  showAddNewCustomAttributeButton: false
}

class SectionWithFields extends React.Component {
  state = {
    isOpen: false,
    isSaving: false
  }

  openEditAttributeDrawer = () => this.setState({ isOpen: true })
  closeEditAttributeDrawer = () => {
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

  getSectionFields = () => {
    const orderedFields = orderFields(this.props.fields, this.props.fieldsOrder)

    const fields = orderedFields.map(field => {
      const { attribute_def } = field
      const value = field[attribute_def.data_type]

      if (!value) {
        return null
      }

      let title = attribute_def.label

      if (field.label) {
        title = `${field.label}${
          attribute_def.name !== 'website' ? ` ${title}` : ''
        }`
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
          {title}
        </dt>,
        <dd
          key={`${field.id}_value`}
          style={{ color: '#17283a', marginBottom: '1em' }}
        >
          {getFormater(field)(value)}
        </dd>
      ]
    })

    if (fields.length > 0) {
      return <dl style={{ marginBottom: '1em' }}>{fields}</dl>
    }

    return null
  }

  render() {
    const {
      addNewFieldButtonText,
      showAddNewCustomAttributeButton
    } = this.props
    const sectionTitle = this.props.title || this.props.section
    const sectionFields = this.getSectionFields()

    return (
      <Section
        title={sectionTitle}
        onEdit={sectionFields ? this.openEditAttributeDrawer : undefined}
      >
        {sectionFields}
        {(addNewFieldButtonText || showAddNewCustomAttributeButton) && (
          <div
            style={{
              textAlign: 'center',
              marginTop: sectionFields ? 0 : '0.5em',
              marginBottom: '1.5em'
            }}
          >
            {addNewFieldButtonText && (
              <ActionButton
                inverse
                onClick={this.openEditAttributeDrawer}
                style={{ marginRight: '1em' }}
              >
                {addNewFieldButtonText}
              </ActionButton>
            )}
            {showAddNewCustomAttributeButton && (
              <ActionButton inverse onClick={this.openEditAttributeDrawer}>
                Add new property
              </ActionButton>
            )}
          </div>
        )}

        <EditForm
          fields={this.getModalFields()}
          isOpen={this.state.isOpen}
          onClose={this.closeEditAttributeDrawer}
          submitting={this.state.isSaving}
          title={`Edit ${sectionTitle}`}
          onSubmit={this.handleOnSubmit}
        />
      </Section>
    )
  }
}

SectionWithFields.propTypes = propTypes
SectionWithFields.defaultProps = defaultProps

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
