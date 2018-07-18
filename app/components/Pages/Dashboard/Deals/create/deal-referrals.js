import React from 'react'
import _ from 'underscore'
import CrudRole from './crud-role'

export default ({
  referrals,
  dealSide,
  onUpsertReferral,
  onRemoveReferral
}) => {
  const sharedProps = {
    roleType: 'referral',
    allowedRoles:
      dealSide === 'Buying' ? ['BuyerReferral'] : ['SellerReferral'],
    onUpsertUser: onUpsertReferral
  }

  return (
    <div className="form-section deal-people deal-referral">
      <div className="hero">
        Did someone refer the {dealSide === 'Buying' ? 'buyer' : 'seller'}?
      </div>

      <div className="people-container">
        {_.map(referrals, (referral, id) => (
          <CrudRole
            key={id}
            user={referral}
            modalTitle="Update Referral"
            onRemoveUser={onRemoveReferral}
            {...sharedProps}
          />
        ))}

        <CrudRole
          modalTitle="Add Referral"
          ctaTitle="Add Referral"
          {...sharedProps}
        />
      </div>
    </div>
  )
}
