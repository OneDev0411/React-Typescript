import React from 'react'
import _ from 'underscore'
import CrudRole from './crud-role'

const BUYING = 'Buying'
const SELLING = 'Selling'

function getRoles(side) {
  if (side === BUYING) {
    return ['Buyer', 'Tenant']
  } else if (side === SELLING) {
    return ['Seller', 'Landlord']
  }

  return []
}

export default ({
  clients,
  dealSide,
  onUpsertClient,
  onRemoveClient
}) => {
  const allowedRoles = getRoles(dealSide)

  return (
    <div className="form-section deal-people deal-client">
      <div className="hero">
        Who are the {dealSide === 'Buying' ? 'buyers' : 'sellers'}?&nbsp;
        <span className="required">*</span>
      </div>

      <div className="people-container">
        {
          _.map(clients, (agent, id) =>
            <CrudRole
              key={id}
              role={agent}
              modalTitle="Edit client"
              buttonText="Update"
              allowedRoles={allowedRoles}
              onRemoveRole={(id) => onRemoveClient(id)}
              onUpsertRole={newRole => onUpsertClient({ ...agent, ...newRole })}
            />
          )
        }

        <CrudRole
          modalTitle="Add a client"
          ctaTitle="Add a client"
          allowedRoles={allowedRoles}
          onUpsertRole={onUpsertClient}
        />
      </div>
    </div>
  )
}
