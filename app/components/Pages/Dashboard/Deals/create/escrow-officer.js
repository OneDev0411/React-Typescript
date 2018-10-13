import React from 'react'
import _ from 'underscore'
import cn from 'classnames'
import CrudRole from './crud-role'
import RequiredIcon from '../../../../../views/components/SvgIcons/Required/IconRequired'
import { H2 } from 'components/Typography/headings'

export default ({
  isRequired,
  hasError,
  escrowOfficers,
  onRemoveEscrowOfficer,
  onUpsertEscrowOfficer
}) => {
  const sharedProps = {
    roleType: 'title',
    allowedRoles: ['Title'],
    onUpsertUser: onUpsertEscrowOfficer
  }

  return (
    <div className="form-section deal-people deal-client">
      <H2 className={cn('hero', { hasError })}>
        Do you have Title company and Escrow officer information? &nbsp;
        {isRequired && <span className="required">*</span>}
        {hasError && <RequiredIcon />}
      </H2>

      <div className="people-container">
        {_.map(escrowOfficers, (agent, id) => (
          <CrudRole
            key={id}
            user={agent}
            modalTitle="Update Escrow Officer"
            onRemoveUser={onRemoveEscrowOfficer}
            {...sharedProps}
          />
        ))}

        <CrudRole
          modalTitle="Add Escrow Officer"
          ctaTitle="Add Escrow Officer"
          {...sharedProps}
        />
      </div>
    </div>
  )
}
