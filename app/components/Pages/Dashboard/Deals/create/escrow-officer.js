import React from 'react'
import _ from 'underscore'
import CrudRole from './crud-role'
import RoleItem from './role-item'

export default ({
  escrowOfficers,
  onRemoveEscrowOfficer,
  onUpsertEscrowOfficer
}) => {
  const allowedRoles = ['Title'] // Title == Escrow Officer

  return (
    <div className="form-section deal-people deal-client">
      <div className="hero">
        Do you have Title company and Escrow officer information?
      </div>

      <div className="people-container">
        {_.map(escrowOfficers, (agent, id) => (
          <CrudRole
            key={id}
            role={agent}
            allowedRoles={allowedRoles}
            modalTitle="Edit Escrow Officer"
            onRemoveRole={id => onRemoveEscrowOfficer(id)}
            onUpsertRole={onUpsertEscrowOfficer}
          />
        ))}

        <CrudRole
          modalTitle="Add Escrow Officer"
          ctaTitle="Add Escrow Officer"
          allowedRoles={allowedRoles}
          onUpsertRole={onUpsertEscrowOfficer}
        />
      </div>
    </div>
  )
}
