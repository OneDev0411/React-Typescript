import React from 'react'
import cuid from 'cuid'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'
import { deleteAttribute } from 'models/contacts/delete-attribute'

import Button from 'components/Button/ActionButton'
import { ShowMoreLess } from 'components/ShowMoreLess'

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

function getEmptyAttributes(attributes, sectionAttributesDef, is_partner) {
  return sectionAttributesDef
    .filter(
      attribute_def =>
        !attributes.some(
          attribute => attribute.attribute_def.id === attribute_def.id
        )
    )
    .map(attribute_def => ({
      attribute_def,
      id: undefined,
      cuid: cuid(),
      is_partner,
      isActive: false,
      [attribute_def.data_type]: ''
    }))
}

function orderAttributes(attributes, fieldsOrder) {
  return orderFields(attributes, fieldsOrder).filter(
    a =>
      a.attribute_def.show ||
      (a.attribute_def.editable && a[a.attribute_def.data_type])
  )
}

class SectionWithFields extends React.Component {
  constructor(props) {
    super(props)

    const { attributes, sectionAttributesDef } = normalizeAttributes(props)

    this.sectionAttributesDef = sectionAttributesDef

    const allAttributes = [
      ...attributes,
      ...getEmptyAttributes(attributes, sectionAttributesDef, props.isPartner)
    ]

    const orderedAttributes = orderAttributes(allAttributes, props.fieldsOrder)

    this.state = {
      orderedAttributes,
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

  toggleMode = ({ order }) =>
    this.setState(state => ({
      orderedAttributes: state.orderedAttributes.map(a =>
        a.order === order ? { ...a, isActive: !a.isActive } : a
      )
    }))

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

  addEmptyField = attribute => {
    const { attribute_def, order, is_partner } = attribute

    const field = {
      attribute_def,
      id: undefined,
      cuid: cuid(),
      is_partner,
      label: '',
      isActive: true,
      is_primary: false,
      [this.type]: '',
      order: order + 1
    }

    this.setState(state => {
      const shallowCopy = state.orderedAttributes.slice()

      shallowCopy.splice(order + 1, 0, field)

      return {
        orderedAttributes: shallowCopy.map((a, order) => ({ ...a, order }))
      }
    })
  }

  render() {
    const { section } = this.props
    const sectionTitle = this.props.title || section

    return (
      <Section title={sectionTitle}>
        <ShowMoreLess count={4} style={{ padding: '0 1.5rem' }}>
          {this.state.orderedAttributes.map(attribute => (
            <MasterField
              attribute={attribute}
              handleAddNewInstance={this.addEmptyField}
              handleDelete={this.delete}
              handleSave={this.upsert}
              handleToggleMode={this.toggleMode}
              isActive={attribute.isActive}
              key={attribute.id || attribute.cuid}
            />
          ))}

          {this.props.showCustomAttributeMenu && (
            <Button
              appearance="link"
              onClick={this.openCustomAttributeDrawer}
              size="large"
              style={{ margin: '0 -1em 1em' }}
            >
              {`+ Add a custom ${sectionTitle.toLowerCase()}`}
            </Button>
          )}
        </ShowMoreLess>

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
