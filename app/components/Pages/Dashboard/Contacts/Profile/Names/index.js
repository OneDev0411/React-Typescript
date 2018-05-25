import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { upsertContactAttributes } from '../../../../../../store_actions/contacts'
import { selectDefsBySection } from '../../../../../../reducers/contacts/attributeDefs'

import Field from './Field'
import Title from './Title'
import Loading from '../../components/Loading'

class Names extends Component {
  state = {
    isSaving: false
  }

  upsertAttribute = async attribute => {
    const { contact, upsertContactAttributes } = this.props

    this.setState(
      {
        isSaving: true
      },
      async () => {
        try {
          await upsertContactAttributes(contact.id, [attribute])
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
    const { contact, upsertContactAttributes } = this.props

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

          await upsertContactAttributes(contact.id, attributes)
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

  getNameFields = () => {
    let indexedNames = {}
    let { nameAttributes, attributeDefs } = this.props

    let nameSectionDefs = selectDefsBySection(attributeDefs, 'Names')

    if (nameSectionDefs.length === 0) {
      return {}
    }

    if (nameAttributes.length > 0) {
      indexedNames = _.indexBy(
        nameAttributes,
        attribute => attribute.attribute_def.name
      )
    }

    nameSectionDefs.forEach(attribute_def => {
      let field = indexedNames[attribute_def.name]

      if (!field) {
        nameAttributes.push({
          attribute_def,
          [attribute_def.data_type]: null
        })
      }
    })

    return _.chain(nameAttributes)
      .filter(attribute => attribute.attribute_def.show)
      .indexBy(attribute => attribute.attribute_def.name)
      .value()
  }

  render() {
    const { isSaving } = this.state
    const fields = this.getNameFields()

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
  const { attributeDefs } = state.contacts
  const { sections } = contact.sub_contacts[0]
  let nameAttributes = []

  if (sections && sections.Names) {
    nameAttributes = sections.Names
  }

  return { nameAttributes, attributeDefs }
}

export default connect(mapStateToProps, {
  upsertContactAttributes
})(Names)
