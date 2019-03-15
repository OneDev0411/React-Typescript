import React from 'react'
import cuid from 'cuid'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { addAttributes } from 'models/contacts/add-attributes'
import { updateAttribute } from 'models/contacts/update-attribute'
import { deleteAttribute } from 'models/contacts/delete-attribute'

import AddIcon from 'components/SvgIcons/Add/AddIcon'
import { ShowMoreLess } from 'components/ShowMoreLess'
import TextIconButton from 'components/Button/TextIconButton'

import { Section } from '../Section'
import MasterField from '../ContactAttributeInlineEditableField'
import CustomAttributeDrawer from '../../../components/CustomAttributeDrawer'

import { orderFields, normalizeAttributes } from './helpers'

const SHOW_MORE_LESS_LIMIT = 5

const propTypes = {
  addCustomAttributeButtonText: PropTypes.string
}

const defaultProps = {
  addCustomAttributeButtonText: ''
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
      isOpenCustomAttributeDrawer: false,
      orderedAttributes,
      showMoreLessCount: 5
    }
  }

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

  insert = async (cuid, data, attribute_def) => {
    try {
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
    } catch (error) {
      console.log(error)
    }
  }

  update = async (id, data, attribute_def) => {
    try {
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

      this.setState(state => ({
        orderedAttributes: state.orderedAttributes.map(a =>
          a.id !== id
            ? a
            : {
                ...updatedAttribute,
                attribute_def,
                order: a.order
              }
        )
      }))
    } catch (error) {
      console.log(error)
    }
  }

  save = (attribute_def, { id, cuid, ...data }) => {
    if (id == null && cuid == null) {
      return
    }

    if (this.props.isPartner) {
      data = { ...data, is_partner: true }
    }

    if (id) {
      this.update(id, data, attribute_def)
    } else {
      this.insert(cuid, data, attribute_def)
    }
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

      const newState = {
        orderedAttributes: shallowCopy.map((a, order) => ({ ...a, order }))
      }

      if (
        shallowCopy.length > SHOW_MORE_LESS_LIMIT &&
        newOrder >= SHOW_MORE_LESS_LIMIT
      ) {
        newState.showMoreLessCount = state.showMoreLessCount + 1
      }

      return newState
    })
  }

  AddCustomAttributeCallback = attribute_def => {
    this.setState(({ orderedAttributes }) => {
      const order = Math.max(...orderedAttributes.map(a => a.order)) + 1

      return {
        orderedAttributes: [
          ...orderedAttributes,
          generateEmptyAttribute(attribute_def, this.props.isPartner, order)
        ]
      }
    })
  }

  renderFields = () => {
    const { addCustomAttributeButtonText } = this.props
    let items = this.state.orderedAttributes.map(attribute => (
      <MasterField
        attribute={attribute}
        handleAddNewInstance={this.addShadowAttribute}
        handleDelete={this.deleteHandler}
        handleSave={this.save}
        handleToggleMode={this.toggleMode}
        isActive={attribute.isActive}
        key={attribute.cuid || attribute.id}
      />
    ))

    if (addCustomAttributeButtonText) {
      items.push(
        <TextIconButton
          key={cuid()}
          iconLeft={AddIcon}
          onClick={this.openCustomAttributeDrawer}
          style={{ marginBottom: '1em' }}
          text={`Add a custom ${addCustomAttributeButtonText}`}
        />
      )
    }

    return items
  }

  render() {
    const { section } = this.props
    const sectionTitle = this.props.title || section
    const sectionContainerStyle = { padding: '0 1.5rem', display: 'block' }

    return (
      <Section title={sectionTitle}>
        {this.state.orderedAttributes.length > SHOW_MORE_LESS_LIMIT ? (
          <ShowMoreLess
            count={this.state.showMoreLessCount}
            style={sectionContainerStyle}
          >
            {this.renderFields()}
          </ShowMoreLess>
        ) : (
          <div style={sectionContainerStyle}>{this.renderFields()}</div>
        )}

        {this.state.isOpenCustomAttributeDrawer && (
          <CustomAttributeDrawer
            isOpen
            onClose={this.closeNewAttributeDrawer}
            section={Array.isArray(section) ? undefined : section}
            submitCallback={this.AddCustomAttributeCallback}
          />
        )}
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
