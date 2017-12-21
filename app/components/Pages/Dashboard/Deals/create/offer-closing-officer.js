import React from 'react'
import _ from 'underscore'
import CrudRole from './crud-role'
import RoleItem from './role-item'

export default ({
  closingOfficers,
  onRemoveClosingOfficer,
  onUpsertClosingOfficer
}) => {
  const allowedRoles = ['Title'] // Title == Escrow Officer

  return (
    <div className="form-section deal-people deal-client">
      <div className="hero">
       Do you know who the Escrow Officer is?
      </div>

      <div className="people-container">
        {
          _.map(closingOfficers, (agent, id) =>
            <CrudRole
              key={id}
              role={agent}
              allowedRoles={allowedRoles}
              modalTitle="Edit Escrow Officer"
              onRemoveRole={(id) => onRemoveClosingOfficer(id)}
              onUpsertRole={onUpsertClosingOfficer}
            />
          )
        }

        <CrudRole
          modalTitle="Add Escrow Officer"
          ctaTitle="Add Escrow Officer"
          allowedRoles={allowedRoles}
          onUpsertRole={onUpsertClosingOfficer}
        />
      </div>
    </div>
  )
}
