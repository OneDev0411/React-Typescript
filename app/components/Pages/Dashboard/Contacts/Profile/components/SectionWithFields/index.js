import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { getContactAttributesBySection } from 'models/contacts/helpers'
import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'
import { deleteAttribute } from 'models/contacts/delete-attribute'

import { selectDefsBySection } from 'reducers/contacts/attributeDefs'

import CustomAttributeDrawer from '../../../components/CustomAttributeDrawer'
import { Section } from '../Section'
import { orderFields } from './helpers'

import { TextField } from './fields/TextField'
import { SelectField } from './fields/SelectField'
import { DateField } from './fields/DateField'

const propTypes = {
  showCustomAttributeMenu: PropTypes.bool
}

const defaultProps = {
  showCustomAttributeMenu: true
}

class SectionWithFields extends React.Component {
  state = {
    isOpenCustomAttributeDrawer: false
  }

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
    } catch (error) {
      console.log(error)
    }
  }

  get emptyAttributes() {
    return this.props.sectionAttributesDef
      .filter(
        attribute_def =>
          !this.props.fields.some(
            field => field.attribute_def.id === attribute_def.id
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
    const orderedFields = orderFields(
      [...this.props.fields, ...this.emptyAttributes],
      this.props.fieldsOrder
    )

    if (
      section !== 'Dates' &&
      orderedFields.every(f => !f[f.attribute_def.data_type])
    ) {
      return []
    }

    return orderedFields.filter(
      f =>
        f.attribute_def.show ||
        (f.attribute_def.editable && f[f.attribute_def.data_type])
    )
  }

  renderFields = () => {
    let allFields = []

    this.attributes.forEach((attribute, index) => {
      const { attribute_def } = attribute

      const key = `${attribute_def.section}_field_${index}`
      // const placeholder = getPlaceholder(attribute)
      // const validate = getValidator(attribute)

      const _props = {
        key,
        attribute,
        handleSave: this.upsert,
        handleDelete: this.delete
      }

      if (attribute_def.singular) {
        if (attribute_def.data_type === 'date') {
          return allFields.push(<DateField {..._props} />)
        }

        if (attribute_def.enum_values) {
          return allFields.push(<SelectField {..._props} />)
        }

        return allFields.push(<TextField {..._props} />)
      }

      // if (
      //   !allFields.some(
      //     c => c.props.attribute.attribute_def.id === attribute_def.id
      //   )
      // ) {
      //   allFields.push(
      //     <MultiField
      //       attribute={attribute}
      //       key={`${key}_${index}`}
      //       mutators={mutators}
      //       placeholder={placeholder}
      //       validate={validate}
      //     />
      //   )
      // }
    })

    // console.log('render allFields', allFields)

    return allFields
  }

  render() {
    const { section } = this.props
    const sectionTitle = this.props.title || section

    return (
      <Section
        isNew
        onAdd={
          this.props.showCustomAttributeMenu && this.openCustomAttributeDrawer
        }
        title={sectionTitle}
      >
        {this.renderFields()}

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

function mapStateToProps(state, props) {
  let fields = []
  let sectionAttributesDef = []
  const { contact, section } = props
  const { attributeDefs } = state.contacts

  const isParnter = f => (props.isPartner ? f.is_partner : !f.is_partner)

  if (Array.isArray(section)) {
    section.forEach(s => {
      fields = [
        ...fields,
        ...getContactAttributesBySection(contact, s).filter(isParnter)
      ]
      sectionAttributesDef = [
        ...sectionAttributesDef,
        ...selectDefsBySection(attributeDefs, s)
      ]
    })
  } else {
    fields = getContactAttributesBySection(contact, section).filter(isParnter)
    sectionAttributesDef = selectDefsBySection(attributeDefs, section)
  }

  if (Array.isArray(props.validFields)) {
    const isValid = a => a.name && props.validFields.some(vf => vf === a.name)

    fields = fields.filter(f => isValid(f.attribute_def))
    sectionAttributesDef = sectionAttributesDef.filter(isValid)
  }

  return {
    attributeDefs,
    fields,
    sectionAttributesDef
  }
}

export default connect(
  mapStateToProps,
  { notify }
)(SectionWithFields)
