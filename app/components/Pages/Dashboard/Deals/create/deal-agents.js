import React from 'react'
import _ from 'underscore'
import cn from 'classnames'
import CrudRole from './crud-role'
import RequiredIcon from '../../../../../views/components/SvgIcons/Required/IconRequired'

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
  showDealSideAs,
  dealSide,
  shouldPrepopulateAgent = true,
  isCommissionRequired,
  onUpsertAgent,
  onRemoveAgent
}) => {
  const sideName = showDealSideAs || dealSide
  const allowedRoles = getRoles(agents, sideName)
  const isPrimaryAgent =
    ['BuyerAgent', 'SellerAgent'].indexOf(allowedRoles[0]) > -1

  const title = isPrimaryAgent ? 'Add Primary Agent' : 'Add Co-Agent'

  return (
    <div className="form-section deal-people deal-agent">
      <div className={cn('hero', { hasError })}>
        Enter {sideName === BUYING ? 'buyer' : 'listing'} agent’s
        information.&nbsp;
        <span className="required">*</span>
        {hasError && <RequiredIcon />}
      </div>

      <div className="people-container">
        {_.map(agents, (agent, id) => (
          <CrudRole
            key={id}
            user={agent}
            isCommissionRequired={isCommissionRequired}
            dealSide={dealSide}
            modalTitle="Update Agent"
            allowedRoles={allowedRoles}
            onRemoveUser={id => onRemoveAgent(id)}
            onUpsertUser={onUpsertAgent}
          />
        ))}

        <CrudRole
          shouldPrepopulateAgent={shouldPrepopulateAgent && isPrimaryAgent}
          isCommissionRequired={isCommissionRequired}
          dealSide={dealSide}
          modalTitle={title}
          ctaTitle={title}
          allowedRoles={allowedRoles}
          onUpsertUser={onUpsertAgent}
        />
      </div>
    </div>
  )
}
