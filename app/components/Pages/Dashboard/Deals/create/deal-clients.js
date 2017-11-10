import React from 'react'
import _ from 'underscore'
import CrudRole from './crud-role'
import RoleItem from './role-item'

export default ({
  clients,
  onUpsertClient,
  onRemoveClient
}) => {
  const allowedRoles = ['Buyer', 'Seller', 'Landlord', 'Tenant']

  return (
    <div className="form-section deal-people deal-client">
      <div className="hero">
        Who are your clients? <span className="required">*</span>
      </div>

      <div className="people-container">
        {
          _.map(clients, (agent, id) =>
            <CrudRole
              key={id}
              role={agent}
              modalTitle="Edit client"
              allowedRoles={allowedRoles}
              onRemoveRole={(id) => onRemoveClient(id)}
              onUpsertRole={onUpsertClient}
            />
          )
        }

        <CrudRole
          modalTitle="Add your client"
          ctaTitle="Add your client"
          allowedRoles={allowedRoles}
          onUpsertRole={onUpsertClient}
        />
      </div>
    </div>
  )
}
