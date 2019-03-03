import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'
import { deleteAttribute } from 'models/contacts/delete-attribute'

import { Section } from '../Section'
import MasterField from '../ContactAttributeInlineEditableField'
import CustomAttributeDrawer from '../../../components/CustomAttributeDrawer'

import { orderFields, normalizeAttributes } from './helpers'

const propTypes = {
  showCustomAttributeMenu: PropTypes.bool
}

const defaultProps = {
  showCustomAttributeMenu: true
}

class SectionWithFields extends React.Component {
  constructor(props) {
    super(props)

    const { attributes, sectionAttributesDef } = normalizeAttributes(props)

    this.sectionAttributesDef = sectionAttributesDef

    this.state = {
      attributes,
      isOpenCustomAttributeDrawer: false
    }
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (props.contact.updated_at > state.updated_at) {
  //     const { attributes } = normalizeAttributes(props)

  //     attributes.forEach(a => console.log(a.attribute_def.label, a.label, a))

  //     return {
  //       attributes,
  //       updated_at: props.contact.updated_at
  //     }
  //   }

  //   return null
  // }

  openCustomAttributeDrawer = () =>
    this.setState({ isOpenCustomAttributeDrawer: true })

  closeNewAttributeDrawer = () =>
    this.setState({ isOpenCustomAttributeDrawer: false })

  filterEditableFields = field => field.attribute_def.editable

  upsert = async attribute => {
    if (attribute == null) {
      return
    }

    const { contact } = this.props

    if (this.props.isPartner) {
      attribute = { ...attribute, is_partner: true }
    }

    try {
      const updatedContent = await upsertContactAttributes(contact.id, [
        attribute
      ])

      this.props.submitCallback({
        ...contact,
        ...updatedContent
      })

      this.props.notify({
        status: 'success',
        dismissAfter: 4000,
        message: `${attribute.attribute_def.label ||
          attribute.attribute_def.name} updated.`
      })
    } catch (error) {
      console.log(error)
    }
  }

  delete = async attribute => {
    const { contact } = this.props

    try {
      const updatedContent = await deleteAttribute(contact.id, attribute.id, {
        associations: ['contact.updated_by']
      })

      this.setState(
        state => ({
          attributes: state.attributes.filter(a => {
            if (attribute.id) {
              return a.id !== attribute.id
            }

            return (
              a.attribute_def.section !== attribute.attribute_def.section ||
              a.order !== attribute.order
            )
          })
        }),
        () => {
          this.props.submitCallback({
            ...contact,
            ...updatedContent
          })

          this.props.notify({
            status: 'success',
            dismissAfter: 4000,
            message: `${attribute.attribute_def.label ||
              attribute.attribute_def.name} deleted.`
          })
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  addEmptyField = () => {
    console.log('add empty')
  }

  get emptyAttributes() {
    return this.sectionAttributesDef
      .filter(
        attribute_def =>
          !this.state.attributes.some(
            attribute => attribute.attribute_def.id === attribute_def.id
          )
      )
      .map(attribute_def => ({
        attribute_def,
        id: undefined,
        is_partner: this.props.isPartner,
        [attribute_def.data_type]: ''
      }))
  }

  get attributes() {
    const { section } = this.props
    const orderedAttributes = orderFields(
      [...this.state.attributes, ...this.emptyAttributes],
      this.props.fieldsOrder
    )

    if (
      section !== 'Dates' &&
      orderedAttributes.every(a => !a[a.attribute_def.data_type])
    ) {
      return []
    }

    return orderedAttributes.filter(
      a =>
        a.attribute_def.show ||
        (a.attribute_def.editable && a[a.attribute_def.data_type])
    )
  }

  render() {
    const { section } = this.props
    const sectionTitle = this.props.title || section

    return (
      <Section
        onAdd={
          this.props.showCustomAttributeMenu && this.openCustomAttributeDrawer
        }
        title={sectionTitle}
      >
        {this.attributes.map((attribute, index) => (
          <MasterField
            attribute={attribute}
            handleSave={this.upsert}
            handleDelete={this.delete}
            handleAddNew={this.addEmptyField}
            key={`${attribute.attribute_def.section}_field_${index}`}
          />
        ))}

        <CustomAttributeDrawer
          isOpen={this.state.isOpenCustomAttributeDrawer}
          onClose={this.closeNewAttributeDrawer}
          section={Array.isArray(section) ? undefined : section}
        />
      </Section>
    )
  }
}

SectionWithFields.propTypes = propTypes
SectionWithFields.defaultProps = defaultProps

function mapStateToProps(state) {
  return {
    attributeDefs: state.contacts.attributeDefs
  }
}

export default connect(
  mapStateToProps,
  { notify }
)(SectionWithFields)
