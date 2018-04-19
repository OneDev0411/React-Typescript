import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { upsertContactAttributes } from '../../../../../../store_actions/contacts'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'

import Field from './Field'
import Title from './Title'
import Loading from '../../components/Loading'

class Names extends Component {
  state = {
    isSaving: false
  }

  upsertAttribute = async attribute => {
    const { contactId, upsertContactAttributes } = this.props

    this.setState(
      {
        isSaving: true
      },
      async () => {
        try {
          await upsertContactAttributes(contactId, [attribute])
        } catch (error) {
          throw error
        } finally {
          this.setState({
            isSaving: false
          })
        }
      }
    )
  }

  handelOnDelete = async field => {
    const { contactId, upsertContactAttributes } = this.props

    this.setState(
      {
        isSaving: true
      },
      async () => {
        try {
          const attributes = [
            {
              text: '',
              id: field.id
            }
          ]

          await upsertContactAttributes(contactId, attributes)
        } catch (error) {
          throw error
        } finally {
          this.setState({
            isSaving: false
          })
        }
      }
    )
  }

  render() {
    const { fields } = this.props
    const { isSaving } = this.state

    return (
      <div className="c-contact-profile-card">
        <h3 className="c-contact-profile-card__title">Names</h3>
        <div className="c-contact-profile-card__body">
          <ul className="c-contact-details u-unstyled-list">
            <Title
              key="names__title"
              disabled={isSaving}
              field={fields.title}
              onChange={this.upsertAttribute}
            />
            {fields &&
              Object.keys(fields)
                .filter(field => field !== 'title')
                .sort((a, b) => b.index - a.index)
                .map(field => (
                  <Field
                    isSaving={isSaving}
                    field={fields[field]}
                    key={`names_${field}`}
                    onChange={this.upsertAttribute}
                    onDelete={this.handelOnDelete}
                  />
                ))}
            {isSaving && <Loading />}
          </ul>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, { contact }) {
  const { contacts: { attributeDefs } } = state
  const { id: contactId, sub_contacts } = contact
  const { sections: { Names: names } } = sub_contacts[0]

  const fields = getNames(names, attributeDefs)

  return { contactId, names, fields, attributeDefs }
}

export default connect(mapStateToProps, {
  upsertContactAttributes
})(Names)

function getNames(names, attributeDefs) {
  let nameAttributes = names
  const nameFields = [
    'title',
    'first_name',
    'middle_name',
    'last_name',
    'nickname'
  ]

  nameFields.forEach((name, index) => {
    const indexedNames = _.indexBy(
      names,
      attribute => attribute.attribute_def.name
    )

    let field = indexedNames[name]

    if (!field) {
      nameAttributes.push({
        index,
        text: '',
        attribute_def: selectDefinitionByName(attributeDefs, field)
      })
    }
  })

  return _.chain(nameAttributes)
    .map(attribute => {
      if (attribute.index) {
        return attribute
      }

      const index = nameFields.indexOf(attribute.attribute_def.name)

      return {
        ...attribute,
        index: index === -1 ? null : index
      }
    })
    .sort((a, b) => a.index - b.index)
    .indexBy(attribute => attribute.attribute_def.name)
    .value()
}
