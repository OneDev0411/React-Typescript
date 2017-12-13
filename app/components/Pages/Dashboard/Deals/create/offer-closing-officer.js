import React from 'react'
import _ from 'underscore'
import CrudRole from './crud-role'
import RoleItem from './role-item'

export default ({
  closingOfficers,
  onRemoveClosingOfficer,
  onUpsertClosingOfficer
}) => {
  const allowedRoles = ['ClosingOfficer']

  return (
    <div className="form-section deal-people deal-client">
      <div className="hero">
       Do you know who the closing officer is?
      </div>

      <div className="people-container">
        {
          _.map(closingOfficers, (agent, id) =>
            <CrudRole
              key={id}
              role={agent}
              allowedRoles={allowedRoles}
              modalTitle="Edit closing officer"
              onRemoveRole={(id) => onRemoveClosingOfficer(id)}
              onUpsertRole={onUpsertClosingOfficer}
            />
          )
        }

        <CrudRole
          modalTitle="Add closing officer"
          ctaTitle="Add closing officer"
          allowedRoles={allowedRoles}
          onUpsertRole={onUpsertClosingOfficer}
        />
      </div>
    </div>
  )
}
