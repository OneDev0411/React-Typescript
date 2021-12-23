import React from 'react'

import { mdiPlus, mdiChevronUp } from '@mdi/js'
import cuid from 'cuid'
import { connect } from 'react-redux'

import { addNotification as notify } from 'components/notification'
import { addAttributes } from 'models/contacts/add-attributes'
import { deleteAttribute } from 'models/contacts/delete-attribute'
import { getContact } from 'models/contacts/get-contact'
import { updateContactQuery } from 'models/contacts/helpers/default-query'
import { normalizeContact } from 'models/contacts/helpers/normalize-contact'
import { updateAttribute } from 'models/contacts/update-attribute'

import MasterField from '../ContactAttributeInlineEditableField'
import { BasicSection } from '../Section/Basic'
import { SectionButton } from '../Section/Button'

import {
  fieldsNeedUpdateContact,
  orderFields,
  normalizeAttributes
} from './helpers'
import { getContactTriggers } from './helpers/get-contact-triggers'
import { getScheduleEmailTrigger } from './helpers/get-schedule-email-trigger'

function generateEmptyAttribute(attribute_def, is_partner, order) {
  return {
    attribute_def,
    cuid: cuid(),
    is_partner,
    isActive: false,
    isEmpty: true,
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

function orderAttributes(attributes, fieldsOrder, fieldsFilter) {
  return orderFields(attributes, fieldsOrder).filter(attr => {
    if (
      fieldsFilter &&
      Array.isArray(fieldsFilter) &&
      !fieldsFilter.includes(attr.attribute_def.name)
    ) {
      return false
    }

    return (
      attr.attribute_def.show ||
      (attr.attribute_def.editable && attr[attr.attribute_def.data_type])
    )
  })
}

class SectionWithFields extends React.Component {
  constructor(props) {
    super(props)

    const { attributes, sectionAttributesDef } = normalizeAttributes(props)

    this.sectionAttributesDef = sectionAttributesDef

    const emptyAttributes = getEmptyAttributes(
      attributes,
      sectionAttributesDef,
      props.isPartner
    )

    const allAttributes = [...attributes, ...emptyAttributes]
    const shouldToggleEmptyAttributes = Boolean(emptyAttributes)
    const toggleEmptyAttributes = false
    const orderedAttributes = orderAttributes(
      allAttributes,
      props.fieldsOrder,
      props.fieldsFilter
    )
    const isAllFieldsEmpty = attributes.length === 0
    const triggers = getContactTriggers(props.contact)

    this.state = {
      shouldToggleEmptyAttributes,
      toggleEmptyAttributes,
      orderedAttributes,
      isAllFieldsEmpty,
      triggers
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

    const { contact, submitCallback } = this.props

    try {
      const response = await getContact(contact.id, {
        associations: [
          ...updateContactQuery.associations,
          'contact.triggers',
          'trigger.campaign',
          'email_campaign.from',
          'email_campaign.template',
          'template_instance.template'
        ]
      })

      const trigger = getScheduleEmailTrigger(response.data, attribute_def.name)

      this.setState(prevState => ({
        triggers: {
          ...prevState.triggers,
          [attribute_def.name]: trigger
        }
      }))

      if (submitCallback) {
        submitCallback(
          {
            ...normalizeContact(response.data),
            deals: contact.deals
          },
          attribute_def
        )
      }
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

      this.setState(prevState => {
        const isAllFieldsEmpty = prevState.isAllFieldsEmpty
          ? { isAllFieldsEmpty: false }
          : {}

        return {
          ...isAllFieldsEmpty,
          orderedAttributes: prevState.orderedAttributes.map(a =>
            a.cuid !== cuid
              ? a
              : {
                  ...newAttribute,
                  isEmpty: false,
                  attribute_def,
                  order: a.order,
                  cuid
                }
          )
        }
      })

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

      this.setState(prevState => ({
        orderedAttributes: prevState.orderedAttributes.map(a =>
          a.id !== id
            ? a
            : {
                ...updatedAttribute,
                attribute_def,
                order: a.order
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

    const triggers = state.triggers[attribute.attribute_def?.name]
      ? { ...state.triggers, [attribute.attribute_def.name]: null }
      : state.triggers

    if (this.isNotOnlyNonSingularInstanceOf(attribute, state)) {
      return {
        triggers,
        orderedAttributes: state.orderedAttributes
          .filter(a =>
            isShadowField ? a.cuid !== attribute.cuid : a.id !== attribute.id
          )
          .map((a, order) => ({ ...a, order }))
      }
    }

    return {
      triggers,
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

  toggleEmptyFields = () =>
    this.setState(prevState => ({
      toggleEmptyAttributes: !prevState.toggleEmptyAttributes
    }))

  renderToggleButton = () => {
    const { toggleEmptyAttributes } = this.state
    const { expandButtonLabel = 'More Fields', expandButtonIcon = mdiPlus } =
      this.props

    return (
      <SectionButton
        label={!toggleEmptyAttributes ? expandButtonLabel : 'Hide empty fields'}
        icon={!toggleEmptyAttributes ? expandButtonIcon : mdiChevronUp}
        onClick={this.toggleEmptyFields}
      />
    )
  }

  renderField = attribute => {
    const { toggleEmptyAttributes, triggers } = this.state

    if (attribute.isEmpty && !toggleEmptyAttributes) {
      return null
    }

    return (
      <MasterField
        contact={this.props?.contact}
        attribute={attribute}
        trigger={triggers[attribute.attribute_def.name] || null}
        handleAddNewInstance={this.addShadowAttribute}
        handleDelete={this.deleteHandler}
        handleSave={this.save}
        handleToggleMode={this.toggleMode}
        isActive={attribute.isActive}
        key={attribute.cuid || attribute.id}
      />
    )
  }

  render() {
    const { title, contact, renderer, showTitleAnyway } = this.props
    const {
      isAllFieldsEmpty,
      orderedAttributes,
      toggleEmptyAttributes,
      shouldToggleEmptyAttributes
    } = this.state

    if (renderer) {
      return renderer({
        contact,
        isAllFieldsEmpty,
        toggleEmptyAttributes,
        shouldToggleEmptyAttributes,
        attributes: orderedAttributes,
        handleSave: this.save,
        handleDelete: this.deleteHandler,
        handleToggleMode: this.toggleMode,
        handleAddNewInstance: this.addShadowAttribute,
        handletoggleEmptyFields: this.toggleEmptyFields
      })
    }

    if (isAllFieldsEmpty && !toggleEmptyAttributes) {
      return (
        <BasicSection title={showTitleAnyway ? title : undefined}>
          {this.props.children}
          {this.renderToggleButton()}
        </BasicSection>
      )
    }

    return (
      <BasicSection title={title}>
        {(orderedAttributes || []).map(attr => this.renderField(attr))}
        {this.props.children}
        {shouldToggleEmptyAttributes && this.renderToggleButton()}
      </BasicSection>
    )
  }
}

function mapStateToProps(state) {
  return {
    attributeDefs: state.contacts.attributeDefs
  }
}

export default connect(mapStateToProps, { notify })(SectionWithFields)
