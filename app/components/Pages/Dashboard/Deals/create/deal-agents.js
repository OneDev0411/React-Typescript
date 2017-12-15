import React from 'react'
import _ from 'underscore'
import CrudRole from './crud-role'
import RoleItem from './role-item'

const BUYING = 'Buying'
const SELLING = 'Selling'

function getRoles(agents, side) {
  if (side === BUYING) {
    return _.size(agents) === 0 ? ['BuyerAgent'] : ['CoBuyerAgent']
  } else if (side === SELLING) {
    return _.size(agents) === 0 ? ['SellerAgent'] : ['CoSellerAgent']
  } else {
    return []
  }
}

export default ({
  agents,
  dealSide,
  title,
  onUpsertAgent,
  onRemoveAgent
}) => {
  const allowedRoles = getRoles(agents, dealSide)
  const ctaTitle = _.size(agents) === 0 ? 'primary agent' : 'co-agent'

  return (
    <div className="form-section deal-people deal-agent">
      <div className="hero">
        { title || `Who is the ${dealSide === BUYING ? 'buyer' : 'listing'} agent?` }&nbsp;
        <span className="required">*</span>
      </div>

      <div className="people-container">
        {
          _.map(agents, (agent, id) =>
            <CrudRole
              key={id}
              role={agent}
              modalTitle="Edit Agent"
              allowedRoles={allowedRoles}
              onRemoveRole={(id) => onRemoveAgent(id)}
              onUpsertRole={onUpsertAgent}
            />
          )
        }

        <CrudRole
          modalTitle={`Add ${ctaTitle}`}
          ctaTitle={`Add ${ctaTitle}`}
          allowedRoles={allowedRoles}
          onUpsertRole={onUpsertAgent}
        />
      </div>
    </div>
  )
}
