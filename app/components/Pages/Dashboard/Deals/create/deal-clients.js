import React from 'react'
import _ from 'underscore'
import cn from 'classnames'
import CrudRole from './crud-role'
import RequiredIcon from '../../../../../views/components/SvgIcons/Required/IconRequired'

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
  title
}) => {
  if (!title) {
    title = dealSide === 'Buying' ? 'Buyer (Tenant)' : 'Seller (Landlord)'
  }

  const sharedProps = {
    roleType: 'client',
    allowedRoles: getRoles(dealSide),
    onUpsertUser: onUpsertClient
  }

  return (
    <div className="form-section deal-people deal-client">
      <div className={cn('hero', { hasError })}>
        {dealSide === 'Buying'
          ? 'Enter buyer information as shown on offer.'
          : 'Enter the seller’s legal information'}
        &nbsp;
        <span className="required">*</span>
        {hasError && <RequiredIcon />}
      </div>

      <div className="people-container">
        {_.map(clients, (client, id) => (
          <CrudRole
            key={id}
            user={client}
            modalTitle={`Update ${title}`}
            onRemoveUser={id => onRemoveClient(id)}
            {...sharedProps}
          />
        ))}

        <CrudRole
          modalTitle={`Add ${title}`}
          ctaTitle={`Add ${title}`}
          {...sharedProps}
        />
      </div>
    </div>
  )
}
