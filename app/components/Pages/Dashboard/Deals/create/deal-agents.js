import React from 'react'
import _ from 'underscore'
import CrudRole from './crud-role'
import RoleItem from './role-item'

export default ({
  agents,
  onUpsertAgent,
  onRemoveAgent
}) => {
  const allowedRoles = _.size(agents) === 0 ?
    ['BuyerAgent', 'SellerAgent'] :
    ['CoBuyerAgent', 'CoSellerAgent']

  const title = _.size(agents) === 0 ? 'primary agent' : 'co-agent'

  return (
    <div className="form-section deal-people deal-agent">
      <div className="hero">
        Who is the agent on your side? <span className="required">*</span>
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
          modalTitle={`Add ${title}`}
          ctaTitle={`Add ${title}`}
          allowedRoles={allowedRoles}
          onUpsertRole={onUpsertAgent}
        />
      </div>
    </div>
  )
}
