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

/**
 * Co-agents or office double-enders should be chosen from agents list
 * https://gitlab.com/rechat/web/issues/1319
 */
function getShouldShowAgentModal(
  forceSelectRolesFromContactsList,
  dealSide,
  isPrimaryAgent,
  isDoubleEnded,
  allowedRole
) {
  if (forceSelectRolesFromContactsList) {
    return false
  }

  if (
    isPrimaryAgent ||
    isDoubleEnded ||
    (dealSide === SELLING && allowedRole === 'CoSellerAgent') ||
    (dealSide === BUYING && allowedRole === 'CoBuyerAgent')
  ) {
    return true
  }

  return false
}

export default props => {
  const {
    hasError,
    agents,
    dealSide,
    isCommissionRequired,
    onUpsertAgent,
    onRemoveAgent
  } = props

  const sideName = props.showDealSideAs || dealSide
  const allowedRole = getAllowedRole(agents, sideName)
  const isPrimaryAgent = ['BuyerAgent', 'SellerAgent'].includes(allowedRole)

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
            allowedRoles={[allowedRole]}
            onRemoveUser={id => onRemoveAgent(id)}
            onUpsertUser={onUpsertAgent}
          />
        ))}

        <CrudRole
          shouldSelectRoleFromAgentsList={getShouldShowAgentModal(
            props.forceSelectRolesFromContactsList,
            dealSide,
            isPrimaryAgent,
            props.isDoubleEnded,
            allowedRole
          )}
          isCommissionRequired={isCommissionRequired}
          dealSide={dealSide}
          modalTitle={title}
          ctaTitle={title}
          allowedRoles={[allowedRole]}
          onUpsertUser={onUpsertAgent}
        />
      </div>
    </div>
  )
}
