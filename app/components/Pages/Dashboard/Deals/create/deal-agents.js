import React from 'react'
import _ from 'underscore'
import cn from 'classnames'
import CrudRole from './crud-role'
import RequiredIcon from '../../../../../views/components/SvgIcons/Required/IconRequired'

const BUYING = 'Buying'
const SELLING = 'Selling'

function getAllowedRole(agents, side) {
  if (side === BUYING) {
    const hasBuyerAgent = _.find(agents, agent => agent.role === 'BuyerAgent')

    return hasBuyerAgent ? 'CoBuyerAgent' : 'BuyerAgent'
  }

  if (side === SELLING) {
    const hasSellerAgent = _.find(agents, agent => agent.role === 'SellerAgent')

    return hasSellerAgent ? 'CoSellerAgent' : 'SellerAgent'
  }

  return []
}

export default props => {
  const { hasError, agents, dealSide, onRemoveAgent } = props

  const sideName = props.showDealSideAs || dealSide
  const allowedRole = getAllowedRole(agents, sideName)
  const isPrimaryAgent = ['BuyerAgent', 'SellerAgent'].includes(allowedRole)

  const title = isPrimaryAgent ? 'Add Primary Agent' : 'Add Co-Agent'

  const sharedProps = {
    roleType: 'agent',
    dealSide,
    isPrimaryAgent,
    dealEnderType: props.dealEnderType,
    isDoubleEnded: props.isDoubleEnded,
    isCommissionRequired: props.isCommissionRequired,
    allowedRoles: [allowedRole],
    onUpsertUser: props.onUpsertAgent
  }

  return (
    <div className="form-section deal-people deal-agent">
      <div className={cn('hero', { hasError })}>
        Enter {sideName === BUYING ? 'buyer' : 'listing'} agent’s
        information.&nbsp;
        {props.isRequired && <span className="required">*</span>}
        {hasError && <RequiredIcon />}
      </div>

      <div className="people-container">
        {_.map(agents, (agent, id) => (
          <CrudRole
            key={id}
            user={agent}
            modalTitle="Update Agent"
            onRemoveUser={id => onRemoveAgent(id)}
            {...sharedProps}
          />
        ))}

        <CrudRole modalTitle={title} ctaTitle={title} {...sharedProps} />
      </div>
    </div>
  )
}
