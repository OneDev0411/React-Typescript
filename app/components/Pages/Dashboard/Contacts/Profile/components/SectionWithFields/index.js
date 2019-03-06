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

function generateEmptyAttribute(attribute_def, is_partner, order) {
  return {
    attribute_def,
    cuid: cuid(),
    is_partner,
    isActive: false,
    order,
    [attribute_def.data_type]: ''
  }
}

function getEmptyAttributes(attributes, sectionAttributesDef, is_partner) {
  return sectionAttributesDef
    .filter(
      attribute_def =>
        !attributes.some(
          attribute => attribute.attribute_def.id === attribute_def.id
        )
    )
    .map((attribute_def, order) =>
      generateEmptyAttribute(attribute_def, is_partner, order)
    )
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

  isOnlyNonSingularInstance = (state, attribute) => {
    const { attribute_def } = attribute

    return (
      !attribute_def.singular &&
      state.orderedAttributes.filter(
        a => a.attribute_def.id === attribute_def.id
      ).length > 1
    )
  }

  deleteFromState = (state, attribute) => {
    const { isPrimary } = this.props
    const isShadowField = !!attribute.id

    if (this.isOnlyNonSingularInstance(state, attribute)) {
      return {
        orderedAttributes: state.orderedAttributes.filter(a =>
          isShadowField ? a.id !== attribute.id : a.cuid !== attribute.cuid
        )
      }
    }

    return {
      orderedAttributes: state.orderedAttributes.map(a => {
        const emptyAttribute = generateEmptyAttribute(
          attribute.attribute_def,
          isPrimary,
          a.order
        )

        if (isShadowField) {
          return a.id === attribute.id ? emptyAttribute : a
        }

        return a.cuid === attribute.cuid ? emptyAttribute : a
      })
    }
  }

  deleteFromApi = async attribute => {
    let backupList

    this.setState(state => {
      backupList = state.orderedAttributes

      return this.deleteFromState(state, attribute)
    })

    try {
      const { contact } = this.props
      const updatedContent = await deleteAttribute(contact.id, attribute.id, {
        associations: ['contact.updated_by']
      })

      this.props.notify({
        status: 'success',
        dismissAfter: 4000,
        message: `${attribute.attribute_def.label ||
          attribute.attribute_def.name} deleted.`
      })

      this.props.submitCallback({
        ...contact,
        ...updatedContent
      })
    } catch (error) {
      console.log(error)
      this.setState({ orderedAttributes: backupList })
    }
  }

  deleteHandler = attribute => {
    if (attribute.id) {
      return this.deleteFromApi(attribute)
    }

    this.setState(state => this.deleteFromState(state, attribute))
  }

  addShadowAttribute = attribute => {
    const { attribute_def, order, is_partner } = attribute

    const field = {
      attribute_def,
      cuid: cuid(),
      is_partner,
      isActive: true,
      order: order + 1,
      [attribute_def.data_type]: ''
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
              handleAddNewInstance={this.addShadowAttribute}
              handleDelete={this.deleteHandler}
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
