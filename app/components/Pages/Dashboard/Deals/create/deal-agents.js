import React from 'react'
import _ from 'underscore'
import cn from 'classnames'
import CrudRole from './crud-role'

const BUYING = 'Buying'
const SELLING = 'Selling'

function getRoles(agents, side) {
  if (side === BUYING) {
    const hasBuyerAgent = _.find(agents, agent => agent.role === 'BuyerAgent')

    return hasBuyerAgent ? ['CoBuyerAgent'] : ['BuyerAgent']
  }

  if (side === SELLING) {
    const hasSellerAgent = _.find(agents, agent => agent.role === 'SellerAgent')

    return hasSellerAgent ? ['CoSellerAgent'] : ['SellerAgent']
  }

  return []
}

export default ({
  hasError,
  agents,
  dealSide,
  shouldPrepopulateAgent = true,
  isCommissionRequired,
  onUpsertAgent,
  onRemoveAgent
}) => {
  const allowedRoles = getRoles(agents, dealSide)
  const isPrimaryAgent =
    ['BuyerAgent', 'SellerAgent'].indexOf(allowedRoles[0]) > -1

  const title = isPrimaryAgent ? 'Add Primary Agent' : 'Add Co-Agent'

  return (
    <div className="form-section deal-people deal-agent">
      <div className={cn('hero', { hasError })}>
        Enter {dealSide === BUYING ? 'buyer' : 'listing'} agent’s
        information.&nbsp;
        <span className="required">*</span>
      </div>

      <div className="people-container">
        {_.map(agents, (agent, id) => (
          <CrudRole
            key={id}
            role={agent}
            isCommissionRequired={isCommissionRequired}
            modalTitle="Update Agent"
            allowedRoles={allowedRoles}
            onRemoveRole={id => onRemoveAgent(id)}
            onUpsertRole={newRole => onUpsertAgent({ ...agent, ...newRole })}
          />
        ))}

        <CrudRole
          shouldPrepopulateAgent={shouldPrepopulateAgent && isPrimaryAgent}
          isCommissionRequired={isCommissionRequired}
          modalTitle={title}
          ctaTitle={title}
          allowedRoles={allowedRoles}
          onUpsertRole={onUpsertAgent}
        />
      </div>
    </div>
  )
}
