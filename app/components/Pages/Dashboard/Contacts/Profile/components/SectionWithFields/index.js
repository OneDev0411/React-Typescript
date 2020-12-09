import React from 'react'
import cuid from 'cuid'
import { connect } from 'react-redux'
import { addNotification as notify } from 'components/notification'

import { getContact } from 'models/contacts/get-contact'
import { addAttributes } from 'models/contacts/add-attributes'
import { updateAttribute } from 'models/contacts/update-attribute'
import { deleteAttribute } from 'models/contacts/delete-attribute'
import { normalizeContact } from 'models/contacts/helpers/normalize-contact'

import { Section } from '../Section'
import MasterField from '../ContactAttributeInlineEditableField'

import {
  fieldsNeedUpdateContact,
  orderFields,
  normalizeAttributes
} from './helpers'
import { getScheduleEmailTrigger } from './helpers/get-schedule-email-trigger'

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
      trigger: null
    }
  }

  get orderedAttributesCopy() {
    // a shalowCopy
    return this.state.orderedAttributes.slice()
  }

  toggleMode = ({ order }) =>
    this.setState(state => ({
      orderedAttributes: state.orderedAttributes.map(a =>
        a.order === order ? { ...a, isActive: !a.isActive } : a
      )
    }))

  shouldUpdateContact = attribute_def => {
    if (fieldsNeedUpdateContact.includes(attribute_def.name)) {
      return true
    }

    return false
  }

  updateContact = async attribute_def => {
    if (!this.shouldUpdateContact(attribute_def)) {
      return
    }

    const { contact } = this.props

    try {
      const response = await getContact(contact.id, {
        associations: [
          'contact.triggers',
          'trigger.campaign',
          'email_campaign.template',
          'template_instance.template'
        ]
      })

      const trigger = getScheduleEmailTrigger(response.data, attribute_def.name)

      this.setState({ trigger })
      this.props.submitCallback({
        ...normalizeContact(response.data),
        deals: contact.deals
      })
    } catch (error) {
      console.log(error)
    }
  }

  insert = async (cuid, data, attribute_def) => {
    const orderedAttributesCopy = this.orderedAttributesCopy

    try {
      if (data.is_primary) {
        this.setState(({ orderedAttributes }) => ({
          orderedAttributes: orderedAttributes.map(attribute =>
            attribute.cuid !== cuid &&
            attribute.attribute_def.id === attribute_def.id
              ? {
                  ...attribute,
                  is_primary: false,
                  updated_at: new Date().getTime()
                }
              : attribute
          )
        }))
      }

      const response = await addAttributes(this.props.contact.id, [
        { ...data, attribute_def: attribute_def.id }
      ])

      const newAttribute = response.data[0]

      this.props.notify({
        status: 'success',
        dismissAfter: 4000,
        message: `${attribute_def.label || attribute_def.name} added.`
      })

      this.setState(state => ({
        orderedAttributes: state.orderedAttributes.map(a =>
          a.cuid !== cuid
            ? a
            : {
                ...newAttribute,
                attribute_def,
                order: a.order,
                cuid
              }
        )
      }))

      this.updateContact(attribute_def)
    } catch (error) {
      this.setState({
        orderedAttributes: orderedAttributesCopy
      })
      console.log(error)
    }
  }

  update = async (id, data, attribute_def) => {
    const orderedAttributesCopy = this.orderedAttributesCopy

    try {
      if (data.is_primary) {
        this.setState(({ orderedAttributes }) => ({
          orderedAttributes: orderedAttributes.map(attribute =>
            attribute.id !== id &&
            attribute.attribute_def.id === attribute_def.id
              ? {
                  ...attribute,
                  is_primary: false,
                  updated_at: new Date().getTime()
                }
              : attribute
          )
        }))
      }

      const updatedAttribute = await updateAttribute(
        this.props.contact.id,
        id,
        data
      )

      this.props.notify({
        status: 'success',
        dismissAfter: 4000,
        message: `${attribute_def.label || attribute_def.name} updated.`
      })

      this.setState(state => {
        state.orderedAttributes.map(a =>
          a.id !== id
            ? a
            : {
                ...updatedAttribute,
                attribute_def,
                order: a.order
              }
        )
      })

      this.updateContact(attribute_def)
    } catch (error) {
      this.setState({
        orderedAttributes: orderedAttributesCopy
      })
      console.log(error)
    }
  }

  save = (attribute, { id, cuid, ...data }) => {
    if (id == null && cuid == null) {
      return
    }

    if (this.props.isPartner) {
      data = { ...data, is_partner: true }
    }

    const { attribute_def } = attribute

    if (id) {
      // API doesnt like emtpy string https://gitlab.com/rechat/web/issues/2932
      if (data[attribute_def.data_type] === '') {
        this.deleteFromApi(attribute)
      } else {
        this.update(id, data, attribute_def)
      }
    } else {
      this.insert(cuid, data, attribute_def)
    }
  }

  isNotOnlyNonSingularInstanceOf = (attribute, state) => {
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
    const isShadowField = !attribute.id

    if (this.isNotOnlyNonSingularInstanceOf(attribute, state)) {
      return {
        orderedAttributes: state.orderedAttributes
          .filter(a =>
            isShadowField ? a.cuid !== attribute.cuid : a.id !== attribute.id
          )
          .map((a, order) => ({ ...a, order }))
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
          return a.cuid === attribute.cuid ? emptyAttribute : a
        }

        return a.id === attribute.id ? emptyAttribute : a
      })
    }
  }

  deleteFromApi = attribute => {
    let backupList = this.state.orderedAttributes

    this.setState(
      state => {
        return this.deleteFromState(state, attribute)
      },
      async () => {
        try {
          const { contact } = this.props

          await deleteAttribute(contact.id, attribute.id)

          this.props.notify({
            status: 'success',
            dismissAfter: 4000,
            message: `${
              attribute.attribute_def.label || attribute.attribute_def.name
            } deleted.`
          })

          this.updateContact(attribute.attribute_def)
        } catch (error) {
          console.log(error)
          this.setState({ orderedAttributes: backupList })
        }
      }
    )
  }

  deleteHandler = attribute => {
    if (attribute.id) {
      return this.deleteFromApi(attribute)
    }

    this.setState(state => this.deleteFromState(state, attribute))
  }

  addShadowAttribute = attribute => {
    const { attribute_def, order, is_partner } = attribute
    const newOrder = order + 1

    const field = {
      attribute_def,
      cuid: cuid(),
      is_partner,
      isActive: true,
      order: newOrder,
      [attribute_def.data_type]: ''
    }

    this.setState(state => {
      const shallowCopy = state.orderedAttributes.slice()

      shallowCopy.splice(newOrder, 0, field)

      return {
        orderedAttributes: shallowCopy.map((a, order) => ({ ...a, order }))
      }
    })
  }

  render() {
    const { trigger } = this.state
    const { section } = this.props

    return (
      <Section title={this.props.title || section}>
        <div style={{ padding: '0 1.5rem' }}>
          {this.state.orderedAttributes.map(attribute => (
            <MasterField
              contact={this.props?.contact}
              attribute={attribute}
              trigger={
                trigger ||
                getScheduleEmailTrigger(
                  this.props?.contact,
                  attribute.attribute_def.name
                )
              }
              handleAddNewInstance={this.addShadowAttribute}
              handleDelete={this.deleteHandler}
              handleSave={this.save}
              handleToggleMode={this.toggleMode}
              isActive={attribute.isActive}
              key={attribute.cuid || attribute.id}
            />
          ))}
          {this.props.children}
        </div>
      </Section>
    )
  }
}

function mapStateToProps(state) {
  return {
    attributeDefs: state.contacts.attributeDefs
  }
}

export default connect(mapStateToProps, { notify })(SectionWithFields)
