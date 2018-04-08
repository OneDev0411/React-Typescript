import React from 'react'
import _ from 'underscore'
import cn from 'classnames'
import CrudRole from './crud-role'

const BUYING = 'Buying'
const SELLING = 'Selling'

function getRoles(side) {
  if (side === BUYING) {
    return ['Buyer', 'BuyerPowerOfAttorney', 'Tenant', 'TenantPowerOfAttorney']
  } else if (side === SELLING) {
    return [
      'Seller',
      'SellerPowerOfAttorney',
      'Landlord',
      'LandlordPowerOfAttorney'
    ]
  }

  return []
}

export default ({
  hasError,
  clients,
  dealSide,
  onUpsertClient,
  onRemoveClient,
  ctaTitle = 'Add client'
}) => {
  const allowedRoles = getRoles(dealSide)

  return (
    <div className="form-section deal-people deal-client">
      <div className={cn('hero', { hasError })}>
        {dealSide === 'Buying'
          ? 'Enter buyer information as shown on offer.'
          : 'Enter the seller’s legal information'}
        &nbsp;
        <span className="required">*</span>
      </div>

      <div className="people-container">
        {_.map(clients, (agent, id) => (
          <CrudRole
            key={id}
            role={agent}
            modalTitle="Edit client"
            allowedRoles={allowedRoles}
            onRemoveRole={id => onRemoveClient(id)}
            onUpsertRole={newRole => onUpsertClient({ ...agent, ...newRole })}
          />
        ))}

        <CrudRole
          modalTitle="Add a client"
          ctaTitle={ctaTitle}
          allowedRoles={allowedRoles}
          onUpsertRole={onUpsertClient}
        />
      </div>
    </div>
  )
}
