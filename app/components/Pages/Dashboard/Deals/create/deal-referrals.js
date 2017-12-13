import React from 'react'
import _ from 'underscore'
import CrudRole from './crud-role'
import RoleItem from './role-item'

export default ({
  referrals,
  dealSide,
  onUpsertReferral,
  onRemoveReferral
}) => {
  const allowedRoles = (dealSide === 'Buying') ? ['BuyerReferral'] : ['SellerReferral']

  return (
    <div className="form-section deal-people deal-referral">
      <div className="hero">
        Did someone refer the {dealSide === 'Buying' ? 'buyer' : 'seller'}?
      </div>

      <div className="people-container">
        {
          _.map(referrals, (agent, id) =>
            <CrudRole
              key={id}
              role={agent}
              modalTitle="Edit referral"
              allowedRoles={allowedRoles}
              onRemoveRole={(id) => onRemoveReferral(id)}
              onUpsertRole={onUpsertReferral}
            />
          )
        }

        <CrudRole
          modalTitle="Add referral"
          ctaTitle="Add referral"
          allowedRoles={allowedRoles}
          onUpsertRole={onUpsertReferral}
        />
      </div>
    </div>
  )
}
