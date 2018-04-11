import React from 'react'
import _ from 'underscore'
import CrudRole from './crud-role'

export default ({
  referrals,
  dealSide,
  onUpsertReferral,
  onRemoveReferral
}) => {
  const allowedRoles =
    dealSide === 'Buying' ? ['BuyerReferral'] : ['SellerReferral']

  return (
    <div className="form-section deal-people deal-referral">
      <div className="hero">
        Did someone refer the {dealSide === 'Buying' ? 'buyer' : 'seller'}?
      </div>

      <div className="people-container">
        {_.map(referrals, (agent, id) => (
          <CrudRole
            key={id}
            role={agent}
            modalTitle="Update Referral"
            allowedRoles={allowedRoles}
            onRemoveRole={id => onRemoveReferral(id)}
            onUpsertRole={newRole => onUpsertReferral({ ...agent, ...newRole })}
          />
        ))}

        <CrudRole
          modalTitle="Add Referral"
          ctaTitle="Add Referral"
          allowedRoles={allowedRoles}
          onUpsertRole={onUpsertReferral}
        />
      </div>
    </div>
  )
}
