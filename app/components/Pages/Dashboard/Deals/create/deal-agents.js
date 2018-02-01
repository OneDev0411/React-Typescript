import React from 'react'
import _ from 'underscore'
import CrudRole from './crud-role'
import RoleItem from './role-item'

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
  agents,
  dealSide,
  shouldPrepopulateAgent = true,
  isCommissionRequired,
  onUpsertAgent,
  onRemoveAgent
}) => {
  const allowedRoles = getRoles(agents, dealSide)
  const isPrimaryAgent = ['BuyerAgent', 'SellerAgent'].indexOf(allowedRoles[0]) > -1

  const title = isPrimaryAgent ? 'Add primary agent' : 'Add co-agent'

  return (
    <div className="form-section deal-people deal-agent">
      <div className="hero">
        Enter {dealSide === BUYING ? 'buyer' : 'listing'} agent’s information.&nbsp;
        <span className="required">*</span>
      </div>

      <div className="people-container">
        {_.map(agents, (agent, id) => (
          <CrudRole
            key={id}
            role={agent}
            isCommissionRequired={isCommissionRequired}
            modalTitle="Edit Agent"
            buttonText="Update"
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
