import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { AssociationItem } from '../AssocationItem'

AssociationsList.propTypes = {
  associations: PropTypes.arrayOf(PropTypes.shape()),
  handleDelete: PropTypes.func.isRequired,
  defaultAssociation: PropTypes.shape()
}

AssociationsList.defaultProps = {
  associations: []
}

export function AssociationsList({
  associations,
  handleDelete,
  defaultAssociation
}) {
  return (
    <div>
      <Field
        name="associations"
        id="new-task__associations"
        render={({ input }) => {
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
            <Fragment>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {associations.map(association => {
                  if (!association || !association.association_type) {
                    return null
                  }

                  const record = association[association.association_type]

                  return (
                    <AssociationItem
                      record={record}
                      key={record.id || record.title}
                      removable={removable(record.id)}
                      handleRemove={() => removeHandler(association)}
                    />
                  )
                })}
              </div>
            </Fragment>
          )
        }}
      />
    </div>
  )
}
