import React from 'react'
import _ from 'underscore'
import CrudRole from './crud-role'
import RoleItem from './role-item'

const BUYING = 'Buying'
const SELLING = 'Selling'

function getRoles(side) {
  if (side === BUYING) {
    return ['Buyer', 'Tenant']
  } else if (side === SELLING) {
    return ['Seller', 'Landlord']
  } else {
    return []
  }
}

export default ({
  clients,
  dealSide,
  title,
  onUpsertClient,
  onRemoveClient
}) => {
  const allowedRoles = getRoles(dealSide)

  return (
    <div className="form-section deal-people deal-client">
      <div className="hero">
        { title || `Who are the ${dealSide === 'Buying' ? 'buyers' : 'sellers'}`}&nbsp;
        <span className="required">*</span>
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
