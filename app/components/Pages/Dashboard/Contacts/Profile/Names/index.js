import React from 'react'
import { pick } from 'lodash'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import { upsertContactAttributes } from '../../../../../../store_actions/contacts'
import Field from './Field'
import Title from './Title'
import Loading from '../../components/Loading'

const Names = ({ names, upsertAttribute, handelOnDelete, isSaving }) => (
  <div className="c-contact-profile-card">
    <h3 className="c-contact-profile-card__title">Names</h3>
    <div className="c-contact-profile-card__body">
      <ul className="c-contact-details u-unstyled-list">
        <Title
          disabled={isSaving}
          key="names__legal_prefix"
          field={names.legal_prefix}
          onChange={upsertAttribute}
        />
        {names &&
          Object.keys(names)
            .filter(name => name !== 'legal_prefix')
            .map(name => (
              <Field
                field={names[name]}
                isSaving={isSaving}
                key={`names_${names[name].type}`}
                onChange={upsertAttribute}
                onDelete={handelOnDelete}
              />
            ))}
        {isSaving && <Loading />}
      </ul>
    </div>
  </div>
)

function mapStateToProps(state, props) {
  const { contact: { id: contactId, sub_contacts } } = props
  let { names } = sub_contacts[0].attributes

  names = Array.isArray(names) ? getNames(names[0]) : getNames()

  return { contactId, names }
}

const enhance = compose(
  connect(mapStateToProps, {
    upsertContactAttributes
  }),
  withState('isSaving', 'setIsSaving', false),
  withHandlers({
    upsertAttribute: ({
      contact,
      contactId,
      setIsSaving,
      upsertContactAttributes
    }) => async fields => {
      setIsSaving(true)

      try {
        let attributes
        const [field] = fields
        const { type } = field
        let { names } = contact.sub_contacts[0].attributes

        if (names && Object.keys(names).length > 0) {
          attributes = [
            {
              ...names[0],
              [type]: field[type],
              is_primary: true
            }
          ]
        } else {
          attributes = [
            {
              type: 'name',
              id: undefined,
              is_primary: true,
              [type]: field[type]
            }
          ]
        }

        await upsertContactAttributes({
          contactId,
          attributes
        })
      } catch (error) {
        throw error
      } finally {
        setIsSaving(false)
      }
    }
  }),
  withHandlers({
    handelOnDelete: ({
      contact,
      contactId,
      setIsSaving,
      upsertContactAttributes
    }) => async ({ type }) => {
      setIsSaving(true)

      try {
        let { names } = contact.sub_contacts[0].attributes
        const attributes = [
          {
            ...names[0],
            [type]: ''
          }
        ]

        await upsertContactAttributes({
          contactId,
          attributes
        })
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
    legal_prefix: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    legal_first_name: '',
    legal_middle_name: '',
    legal_last_name: '',
    nickname: ''
  }

  if (names && Object.keys(names).length > 0) {
    // eslint-disable-next-line
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
