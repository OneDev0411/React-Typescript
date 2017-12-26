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
  onUpsertAgent,
  onRemoveAgent
}) => {
  const allowedRoles = getRoles(agents, dealSide)
  const title = _.size(agents) === 0 ? 'primary agent' : 'co-agent'

  return (
    <div className="form-section deal-people deal-agent">
      <div className="hero">
        Who is the {dealSide === BUYING ? 'buyer' : 'listing'} agent? <span className="required">*</span>
      </div>

      <div className="people-container">
        {
          _.map(agents, (agent, id) =>
            <CrudRole
              key={id}
              role={agent}
              modalTitle="Edit Agent"
              buttonText="Edit"
              allowedRoles={allowedRoles}
              onRemoveRole={(id) => onRemoveAgent(id)}
              onUpsertRole={newRole => onUpsertAgent({ ...agent, ...newRole })}
            />
          )
        }

        <CrudRole
          modalTitle={`Add ${title}`}
          ctaTitle={`Add ${title}`}
          allowedRoles={allowedRoles}
          onUpsertRole={onUpsertAgent}
        />
      </div>
    </div>
  )
}
