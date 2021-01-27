import React, { useState, useEffect } from 'react'
import { Box, makeStyles } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { useTitle } from 'react-use'
import omit from 'lodash/omit'

import Deal from 'models/Deal'

import {
  createDeal,
  createRoles,
  getContextsByDeal,
  createChecklist
} from 'actions/deals'

import { QuestionWizard } from 'components/QuestionWizard'

import { IAppState } from 'reducers'
import { selectUser } from 'selectors/user'

import { getDealContexts } from './helpers/get-deal-contexts'

import { DealVisibility } from './form/DealVisibility'
import { DealType } from './form/DealType'
import { DealPropertyType } from './form/DealPropertyType'
import { DealPrimaryAgent } from './form/DealPrimaryAgent'
import { DealCoAgent } from './form/DealCoAgent'
import { DealAddress } from './form/DealAddress'
import { DealClient } from './form/DealClient'
import { DealContext } from './form/DealContext'
import { DealEnderType } from './form/DealEnderType'
import { DealCard } from './form/DealCard'

import { Context } from './context'

import type { Form, IDealFormRole } from './types'

const useStyles = makeStyles(
  () => ({
    root: {
      width: '80%',
      margin: '15% auto'
    }
  }),
  {
    name: 'CreateDeal'
  }
)

export default function CreateDeal() {
  useTitle('Create New Deal | Deals | Rechat')

  const classes = useStyles()

  const [dealId, setDealId] = useState<UUID | null>(null)
  const [form, setForm] = useState<Partial<Form>>({
    primaryAgents: {}
  })

  const dispatch = useDispatch()
  const user = useSelector<IAppState, IUser>(state => selectUser(state))
  const deal = useSelector<IAppState, IDeal | null>(({ deals }) =>
    dealId ? deals.list[dealId] : null
  )

  useEffect(() => {
    console.log('[ + ] Loading Deal Statuses')

    dealId && dispatch(getContextsByDeal(dealId))
  }, [dealId, dispatch])

  const dealContexts = getDealContexts(
    user,
    deal ? deal.deal_type : form.side,
    deal ? deal.property_type : form.propertyType
  )

  const dealSide = deal ? deal.deal_type : form.side

  const updateForm = (data: Partial<Form>) => {
    setForm({
      ...form,
      ...data
    })
  }

  const isDoubleEnded = form.enderType
    ? ['AgentDoubleEnder', 'OfficeDoubleEnder'].includes(form.enderType)
    : false

  /**
   * Creates the initial deal as soon as possible and updates
   * the created deal on every step change
   *
   * @param agents - The list of primary agents [BuyerAgent, SellerAgent]
   */
  const createInitialDeal = async (agents: Record<number, IDealFormRole>) => {
    const primaryAgent = Object.values(agents).find(agent =>
      ['SellerAgent', 'BuyerAgent'].includes(agent.role)
    )!

    const deal: IDeal = await Deal.create(user, {
      brand: primaryAgent.brand,
      property_type: form.propertyType,
      deal_type: form.side,
      is_draft: false
    })

    dispatch(createDeal(deal))
    setDealId(deal.id)

    const primaryAgents = Object.values(agents).map(agent =>
      omit(agent, ['id', 'contact'])
    )

    dispatch(createRoles(deal.id, primaryAgents))

    dispatch(
      createChecklist(deal.id, {
        conditions: {
          deal_type: deal.deal_type,
          property_type: deal.property_type
        }
      })
    )
  }

  return null

  return (
    <Context.Provider
      value={{
        deal,
        user
      }}
    >
      <Box className={classes.root}>
        <QuestionWizard defaultStep={0}>
          <DealVisibility />
          <DealType />

          <DealPropertyType />

          {dealSide === 'Buying' && <DealEnderType />}

          {dealSide === 'Buying' && (
            <DealPrimaryAgent
              agentSide="Buying"
              isCommissionRequired={isDoubleEnded}
              title="Enter Buyer Primary Agent’s information"
            />
          )}

          {dealSide && (
            <DealPrimaryAgent
              isCommissionRequired
              agentSide="Selling"
              title="Enter Listing Primary Agent’s information"
              onFinishStep={createInitialDeal}
            />
          )}

          <DealAddress />

          {dealSide === 'Buying' && (
            <DealCoAgent
              agentSide="Buying"
              isCommissionRequired={isDoubleEnded}
              title="Enter Buyer Co-Agent’s information"
            />
          )}

          {dealSide && (
            <DealCoAgent
              isCommissionRequired
              agentSide="Selling"
              title="Enter Listing Co-Agent’s information"
            />
          )}

          {dealSide === 'Buying' && (
            <DealClient
              side="Buying"
              title="Enter buyer information as shown on offer"
            />
          )}

          {dealSide === 'Selling' && (
            <DealClient
              side="Selling"
              title="Enter the seller’s legal information"
            />
          )}

          {deal &&
            dealContexts.map((context: IDealBrandContext) => (
              <DealContext key={context.id} context={context} />
            ))}

          <DealCard />
        </QuestionWizard>
      </Box>
    </Context.Provider>
  )
}
