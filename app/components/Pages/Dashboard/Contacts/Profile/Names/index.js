import React from 'react'
import { pick } from 'lodash'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import { upsertContactAttributes } from '../../../../../../store_actions/contacts'
import { getMostRecentlyAttribute } from '../../../../../../models/contacts'

import Field from './Field'
import Title from './Title'
import Loading from '../../components/Loading'

const Names = ({ fields, upsertAttribute, handelOnDelete, isSaving }) => (
  <div className="c-contact-profile-card">
    <h3 className="c-contact-profile-card__title">Names</h3>
    <div className="c-contact-profile-card__body">
      <ul className="c-contact-details u-unstyled-list">
        <Title
          disabled={isSaving}
          key="names__title"
          field={fields.title}
          onChange={upsertAttribute}
        />
        {fields &&
          Object.keys(fields)
            .filter(name => name !== 'title')
            .map(name => (
              <Field
                field={fields[name]}
                isSaving={isSaving}
                key={`names_${fields[name].type}`}
                onChange={upsertAttribute}
                onDelete={handelOnDelete}
              />
            ))}
        {isSaving && <Loading />}
      </ul>
    </div>
  </div>
)

function mapStateToProps(state, { contact }) {
  const { id: contactId } = contact
  const names = getMostRecentlyAttribute({ contact, attributeName: 'names' })
  const fields = getNames(names)

  return { contactId, names, fields }
}

const enhance = compose(
  connect(mapStateToProps, {
    upsertContactAttributes
  }),
  withState('isSaving', 'setIsSaving', false),
  withHandlers({
    upsertAttribute: ({
      names,
      contact,
      contactId,
      setIsSaving,
      upsertContactAttributes
    }) => async fields => {
      setIsSaving(true)

      try {
        let id
        let attributes
        const [field] = fields
        const { type } = field
        const {
          names: firstSubContactNames
        } = contact.sub_contacts[0].attributes

        if (
          Array.isArray(firstSubContactNames) &&
          Object.keys(firstSubContactNames[0]).length > 0
        ) {
          id = firstSubContactNames[0].id
        }

        if (id) {
          attributes = [
            {
              ...names,
              id,
              [type]: field[type],
              is_primary: true
            }
          ]
        } else {
          attributes = [
            {
              type: 'name',
              id,
              is_primary: true,
              [type]: field[type]
            }
          ]
        }

        await upsertContactAttributes(contactId, attributes)
      } catch (error) {
        throw error
      } finally {
        setIsSaving(false)
      }
    }
  }),
  withHandlers({
    handelOnDelete: ({
      names,
      contact,
      contactId,
      setIsSaving,
      upsertContactAttributes
    }) => async ({ type }) => {
      setIsSaving(true)

      try {
        let id
        const {
          names: firstSubContactNames
        } = contact.sub_contacts[0].attributes

        if (
          Array.isArray(firstSubContactNames) &&
          Object.keys(firstSubContactNames[0]).length > 0
        ) {
          id = firstSubContactNames[0].id
        }

        const attributes = [
          {
            ...names,
            id,
            [type]: ''
          }
        ]

        await upsertContactAttributes(contactId, attributes)
      } catch (error) {
        throw error
      } finally {
        setIsSaving(false)
      }
    }
  })
)

export default enhance(Names)

function getNames(names) {
  let id
  let nameAttribute

  const nameFields = {
    title: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    nickname: ''
  }

  if (names && Object.keys(names).length > 0) {
    id = names.id

    nameAttribute = {
      ...nameFields,
      ...pick(names, Object.keys(nameFields))
    }
  } else {
    nameAttribute = nameFields
  }

  const getTitle = name =>
    name
      .split('_')
      .map(i => i.charAt(0).toUpperCase() + i.substr(1, i.length))
      .join(' ')

  if (Object.keys(nameAttribute).length > 0) {
    const fields = {}

    Object.keys(nameAttribute).forEach(name => {
      fields[name] = {
        id,
        type: name,
        [name]: nameAttribute[name],
        name: getTitle(name)
      }
    })

    return fields
  }
}
