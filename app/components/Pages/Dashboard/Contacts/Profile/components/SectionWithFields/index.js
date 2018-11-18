import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import {
  upsertContactAttributes,
  deleteAttributes
} from '../../../../../../../store_actions/contacts'
import { selectDefsBySection } from '../../../../../../../reducers/contacts/attributeDefs'
import { getContactAttributesBySection } from '../../../../../../../models/contacts/helpers'
import ActionButton from '../../../../../../../views/components/Button/ActionButton'
import { getContactOriginalSourceTitle } from '../../../../../../../utils/get-contact-original-source-title'

import { EditForm } from './EditFormDrawer'
import CustomAttributeDrawer from '../../../components/CustomAttributeDrawer'
import { Section } from '../Section'
import {
  orderFields,
  formatPreSave,
  getFormater,
  getInitialValues
} from './helpers'
import StarIcon from '../../../../../../../views/components/SvgIcons/Star/StarIcon'
import Tooltip from '../../../../../../../views/components/tooltip'

const propTypes = {
  addNewFieldButtonText: PropTypes.string,
  showAddNewCustomAttributeButton: PropTypes.bool
}

const defaultProps = {
  addNewFieldButtonText: '',
  showAddNewCustomAttributeButton: true
}

class SectionWithFields extends React.Component {
  state = {
    isOpenEditDrawer: false,
    isOpenNewAttributeDrawer: false
  }

  openEditAttributeDrawer = () => this.setState({ isOpenEditDrawer: true })
  closeEditAttributeDrawer = () => this.setState({ isOpenEditDrawer: false })

  openNewAttributeDrawer = () =>
    this.setState({ isOpenNewAttributeDrawer: true })
  closeNewAttributeDrawer = () =>
    this.setState({ isOpenNewAttributeDrawer: false })

  filterEditableFields = field =>
    field.attribute_def.show && field.attribute_def.editable

  handleOnSubmit = async values => {
    try {
      const { upsertedAttributeList, deletedAttributesList } = formatPreSave(
        this.props.fields.filter(this.filterEditableFields),
        values
      )

      if (upsertedAttributeList.length > 0) {
        await this.props.upsertContactAttributes(
          this.props.contact.id,
          upsertedAttributeList.map(
            a => (this.props.isPartner ? { ...a, is_partner: true } : a)
          )
        )
      }

      if (deletedAttributesList.length > 0) {
        await this.props.deleteAttributes(
          this.props.contact.id,
          deletedAttributesList
        )
      }

      this.closeEditAttributeDrawer()
      this.props.notify({
        status: 'success',
        dismissAfter: 4000,
        message: `${this.props.title || this.props.section} updated.`
      })
    } catch (error) {
      console.log(error)
    }
  }

  getEmptyFields = () =>
    this.props.sectionAttributesDef
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

  getModalFields = () => {
    const orderedFields = orderFields(
      [...this.props.fields, ...this.getEmptyFields()],
      this.props.fieldsOrder
    )

    return orderedFields.filter(this.filterEditableFields)
  }

  getSectionFields = () => {
    const { isPartner } = this.props
    const orderedFields = orderFields(
      [...this.props.fields, ...this.getEmptyFields()],
      this.props.fieldsOrder
    )

    if (orderedFields.every(f => !f[f.attribute_def.data_type])) {
      return null
    }

    const fields = orderedFields
      .filter(field => field.attribute_def.show)
      .map((field, index) => {
        const { attribute_def } = field
        let value = field[attribute_def.data_type]
        let key = `${this.props.section}_field_${index}`

        if (isPartner) {
          key = `partner_${key}`
        }

        const getTitle = () => {
          if (field.label) {
            return field.label
          }

          if (value && attribute_def.has_label) {
            return attribute_def.labels[0]
          }

          return attribute_def.label
        }

        if (attribute_def.name === 'source_type') {
          value = getContactOriginalSourceTitle(value)
        }

        return [
          <dt
            key={`${key}_title`}
            style={{
              color: '#7f7f7f',
              fontWeight: '300'
            }}
          >
            {getTitle()}
          </dt>,
          <dd
            key={`${key}_value`}
            style={{
              marginBottom: '1em',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {value ? getFormater(field)(value) : '-'}
            {value &&
              field.is_primary && (
                <Tooltip caption="Primary">
                  <StarIcon
                    style={{
                      fill: '#f5a623',
                      width: '1em',
                      height: '1em',
                      marginLeft: '0.5em'
                    }}
                  />
                </Tooltip>
              )}
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
      section,
      isPartner,
      addNewFieldButtonText,
      showAddNewCustomAttributeButton
    } = this.props
    const modalFields = this.getModalFields()
    const sectionFields = this.getSectionFields()
    const sectionTitle = this.props.title || section

    return (
      <Section
        onAdd={!isPartner && this.openNewAttributeDrawer}
        onEdit={sectionFields ? this.openEditAttributeDrawer : undefined}
        title={sectionTitle}
      >
        {sectionFields}
        {(addNewFieldButtonText || showAddNewCustomAttributeButton) && (
          <div
            style={{
              marginTop: sectionFields ? 0 : '0.5em'
            }}
          >
            {addNewFieldButtonText &&
              !sectionFields && (
                <ActionButton
                  size="small"
                  appearance="outline"
                  onClick={this.openEditAttributeDrawer}
                  style={{ marginRight: '1em' }}
                >
                  {addNewFieldButtonText}
                </ActionButton>
              )}
          </div>
        )}

        {this.state.isOpenEditDrawer && (
          <EditForm
            fields={modalFields}
            initialValues={getInitialValues(modalFields)}
            isOpen
            isPartner={isPartner}
            onClose={this.closeEditAttributeDrawer}
            title={`Edit ${sectionTitle}`}
            onSubmit={this.handleOnSubmit}
          />
        )}

        <CustomAttributeDrawer
          isOpen={this.state.isOpenNewAttributeDrawer}
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
  { upsertContactAttributes, deleteAttributes, notify }
)(SectionWithFields)
