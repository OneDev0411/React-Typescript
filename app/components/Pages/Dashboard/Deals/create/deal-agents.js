import React from 'react'
import _ from 'underscore'
import cn from 'classnames'

import { H2 } from 'components/Typography/headings'

import CrudRole from './crud-role'
import RequiredErrorSign from './required-error-sign'

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
    // https://gitlab.com/rechat/web/issues/1671#note_184505249
    isPrimaryAgent: isPrimaryAgent && !props.isBackOffice,
    dealEnderType: props.dealEnderType,
    isCommissionRequired: props.isCommissionRequired,
    allowedRoles: [allowedRole],
    onUpsertUser: props.onUpsertAgent
  }

  return (
    <div className="form-section deal-people deal-agent">
      <H2 className={cn('hero', { hasError })}>
        Enter {sideName === BUYING ? 'buyer' : 'listing'} agent’s
        information.&nbsp;
        {props.isRequired && <span className="required">*</span>}
        {hasError && <RequiredErrorSign />}
      </H2>

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
