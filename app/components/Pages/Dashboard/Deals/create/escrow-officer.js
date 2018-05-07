import React from 'react'
import _ from 'underscore'
import cn from 'classnames'
import CrudRole from './crud-role'
import RequiredIcon from '../../../../../views/components/SvgIcons/Required/IconRequired'

export default ({
  hasError,
  escrowOfficers,
  onRemoveEscrowOfficer,
  onUpsertEscrowOfficer
}) => {
  const allowedRoles = ['Title'] // Title == Escrow Officer

  return (
    <div className="form-section deal-people deal-client">
      <div className={cn('hero', { hasError })}>
        Do you have Title company and Escrow officer information? &nbsp;
        <span className="required">*</span>
        {hasError && <RequiredIcon />}
      </div>

      <div className="people-container">
        {_.map(escrowOfficers, (agent, id) => (
          <CrudRole
            key={id}
            user={agent}
            allowedRoles={allowedRoles}
            modalTitle="Update Escrow Officer"
            onRemoveUser={onRemoveEscrowOfficer}
            onUpsertUser={onUpsertEscrowOfficer}
          />
        ))}

        <CrudRole
          modalTitle="Add Escrow Officer"
          ctaTitle="Add Escrow Officer"
          allowedRoles={allowedRoles}
          onUpsertUser={onUpsertEscrowOfficer}
        />
      </div>
    </div>
  )
}
