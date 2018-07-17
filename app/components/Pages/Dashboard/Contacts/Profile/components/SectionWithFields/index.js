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

  handleOnSubmit = async values => {
    try {
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

      this.closeEditAttributeDrawer()
      this.props.notify({
        status: 'success',
        dismissAfter: 4000,
        message: `${this.props.section} updated.`
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
        [attribute_def.data_type]: ''
      }))

  getModalFields = () => {
    const orderedFields = orderFields(
      [...this.props.fields, ...this.getEmptyFields()],
      this.props.fieldsOrder
    )

    return orderedFields.filter(
      field => field.attribute_def.show && field.attribute_def.editable
    )
  }

  getSectionFields = () => {
    const orderedFields = orderFields(
      [...this.props.fields, ...this.getEmptyFields()],
      this.props.fieldsOrder
    )

    const fields = orderedFields
      .filter(field => field.attribute_def.show)
      .map((field, index) => {
        const { attribute_def } = field
        let value = field[attribute_def.data_type]
        const key = `${this.props.section}_field_${index}`

        const getTitle = () => {
          let title = attribute_def.label

          if (!field.label) {
            return title
          }

          switch (attribute_def.name) {
            case 'website':
              return title
            case 'important_date':
              return field.label
            default:
              return `${field.label} ${title}`
          }
        }

        if (attribute_def.name === 'source_type') {
          value = getContactOriginalSourceTitle(value)
        }

        return [
          <dt
            key={`${key}_title`}
            style={{
              color: '#758a9e',
              fontWeight: '500',
              marginBottom: '0.25em'
            }}
          >
            {getTitle()}
          </dt>,
          <dd
            key={`${key}_value`}
            style={{
              color: '#17283a',
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
                      width: '16px',
                      height: '16px',
                      marginLeft: '5px'
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
      addNewFieldButtonText,
      showAddNewCustomAttributeButton
    } = this.props
    const modalFields = this.getModalFields()
    const sectionTitle = this.props.title || this.props.section
    const sectionFields = this.getSectionFields()

    return (
      <Section
        title={sectionTitle}
        onEdit={sectionFields ? this.openEditAttributeDrawer : undefined}
        onAdd={this.openNewAttributeDrawer}
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
            {addNewFieldButtonText &&
              !sectionFields && (
                <ActionButton
                  inverse
                  onClick={this.openEditAttributeDrawer}
                  style={{ marginRight: '1em' }}
                >
                  {addNewFieldButtonText}
                </ActionButton>
              )}
          </div>
        )}

        <EditForm
          fields={modalFields}
          initialValues={getInitialValues(modalFields)}
          isOpen={this.state.isOpenEditDrawer}
          onClose={this.closeEditAttributeDrawer}
          title={`Edit ${sectionTitle}`}
          onSubmit={this.handleOnSubmit}
        />

        <CustomAttributeDrawer
          isOpen={this.state.isOpenNewAttributeDrawer}
          onClose={this.closeNewAttributeDrawer}
          section={this.props.section}
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
  { upsertContactAttributes, deleteAttributes, notify }
)(SectionWithFields)
