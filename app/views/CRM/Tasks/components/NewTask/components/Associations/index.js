import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import Association from '../../../CRMTaskAssociation'
import AddContactAssociation from '../../../../../../components/AddContactAssociations'
import AddListingAssociation from '../../../../../../components/AddListingAssociations'

const propTypes = {
  associations: PropTypes.arrayOf(PropTypes.shape()),
  handleCreate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  defaultAssociation: PropTypes.shape()
}

const defaultProps = {
  associations: []
}

function Associations({
  associations,
  handleCreate,
  handleDelete,
  defaultAssociation
}) {
  return (
    <div className="c-new-task__associations c-new-task__field">
      <div
        className="c-new-task__field__label"
        style={{ marginBottom: '1em', cursor: 'initial' }}
      >
        Associated Records
      </div>
      <div style={{ display: 'flex' }}>
        <Field
          name="associations"
          id="new-task__associations"
          render={({ input }) => {
            const addHandler = async (object = {}, handleClose) => {
              const { type } = object

              if (!type) {
                return
              }

              const isDuplicate = associations.some(
                association =>
                  association[type] && association[type].id === object.id
              )

              if (!isDuplicate) {
                let nextAssociations

                const newAssociation = await handleCreate({
                  [type]: object.id,
                  association_type: type
                })

                if (newAssociation) {
                  nextAssociations = [
                    ...associations,
                    {
                      ...newAssociation,
                      [type]: object
                    }
                  ]
                } else {
                  nextAssociations = [
                    ...associations,
                    {
                      [type]: object,
                      association_type: type
                    }
                  ]
                }

                input.onChange(nextAssociations)
                handleClose()
              }
            }

            const removeHandler = async association => {
              let newAssociations

              if (association.id) {
                await handleDelete(association.id)

                newAssociations = associations.filter(
                  a => a.id !== association.id
                )
              } else {
                newAssociations = associations.filter(
                  a =>
                    a[a.association_type].id !==
                    association[association.association_type].id
                )
              }

              input.onChange(newAssociations)
            }

            const removable = id => {
              if (!defaultAssociation) {
                return true
              }

              const { association_type } = defaultAssociation

              if (!association_type) {
                return true
              }

              const record = defaultAssociation[association_type]

              if (!record || !record.id || record.id !== id) {
                return true
              }

              return false
            }

            return (
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {associations.map(association => {
                    if (!association || !association.association_type) {
                      return null
                    }

                    const record = association[association.association_type]

                    return (
                      <Association
                        record={record}
                        key={record.id || record.title}
                        removable={removable(record.id)}
                        handleRemove={() => removeHandler(association)}
                      />
                    )
                  })}
                </div>
                <div style={{ display: 'flex', marginBottom: '1em' }}>
                  <AddContactAssociation handleAdd={addHandler} />
                  <AddListingAssociation handleAdd={addHandler} />
                </div>
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}

Associations.propTypes = propTypes
Associations.defaultProps = defaultProps

export default Associations
