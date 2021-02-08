import React, { useState, useEffect } from 'react'
import { Box, makeStyles, Theme } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { useTitle } from 'react-use'

import { useForm, Controller } from 'react-hook-form'

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
import { getChangedRoles } from './helpers/get-changed-roles'

import { DealType } from './form/DealType'
import { DealPropertyType } from './form/DealPropertyType'
import { DealPrimaryAgent } from './form/DealPrimaryAgent'
import { DealAddress } from './form/DealAddress'
import { DealClient } from './form/DealClient'
import { DealContext } from './form/DealContext'
import { DealEnderType } from './form/DealEnderType'
import { DealCard } from './form/DealCard'

import { useDealRoles } from './hooks/use-deal-roles'

import { Context } from './context'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      width: '80%',
      maxWidth: '800px',
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
  const { control, watch } = useForm()

  const [dealId, setDealId] = useState<UUID | null>(null)

  const dispatch = useDispatch()
  const user = useSelector<IAppState, IUser>(state => selectUser(state))
  const deal = useSelector<IAppState, IDeal | null>(({ deals }) =>
    dealId ? deals.list[dealId] : null
  )

  const roles = useDealRoles(deal)

  const dealType = watch('deal_type')
  const propertyType = watch('property_type')
  const enderType = watch('ender_type')

  useEffect(() => {
    if (dealId) {
      dispatch(getContextsByDeal(dealId))
    }
  }, [dealId, dispatch])

  const dealContexts = getDealContexts(user, dealType, propertyType)

  const isDoubleEnded = ['AgentDoubleEnder', 'OfficeDoubleEnder'].includes(
    enderType || ''
  )

  /**
   * Creates the initial deal as soon as possible and updates
   * the created deal on every step change
   *
   * @param agents - The list of primary agents [BuyerAgent, SellerAgent]
   */
  const createInitialDeal = async () => {
    if (deal) {
      return
    }

    const values = control.getValues()

    console.log(values)

    return

    const agents = [].concat(
      values.buying_primary_agent || [],
      values.selling_primary_agent || []
    ) as IDealRole[]

    const primaryAgent = agents.find(agent =>
      ['SellerAgent', 'BuyerAgent'].includes(agent.role)
    )!

    const newDeal: IDeal = await Deal.create(user, {
      brand: primaryAgent.brand,
      property_type: propertyType,
      deal_type: dealType,
      is_draft: true
    })

    dispatch(createDeal(newDeal))
    setDealId(newDeal.id)

    const primaryAgents = agents.map(agent => ({
      ...agent,
      id: undefined,
      contact: undefined
    }))

    await Promise.all([
      dispatch(createRoles(newDeal.id, primaryAgents)),
      dispatch(
        createChecklist(newDeal.id, {
          conditions: {
            deal_type: newDeal.deal_type,
            property_type: newDeal.property_type
          }
        })
      )
    ])
  }

  return (
    <Context.Provider
      value={{
        deal,
        user
      }}
    >
      <Box className={classes.root}>
        <QuestionWizard>
          <Controller
            name="address"
            control={control}
            render={({ onChange }) => <DealAddress onChange={onChange} />}
          />

          <Controller
            name="property_type"
            control={control}
            render={({ onChange }) => <DealPropertyType onChange={onChange} />}
          />

          <Controller
            name="deal_type"
            control={control}
            render={({ onChange }) => (
              <DealType propertyType={propertyType} onChange={onChange} />
            )}
          />

          {dealType === 'Buying' && (
            <Controller
              name="ender_type"
              control={control}
              render={({ onChange }) => <DealEnderType onChange={onChange} />}
            />
          )}

          {dealType === 'Buying' && (
            <Controller
              name="buying_primary_agent"
              control={control}
              render={({ value = [], onChange }) => (
                <DealPrimaryAgent
                  side="Buying"
                  isCommissionRequired={isDoubleEnded}
                  title="Enter Buyer Agent’s information"
                  roles={value}
                  onChange={(role, type) =>
                    onChange(getChangedRoles(value, role, type))
                  }
                />
              )}
            />
          )}

          <Controller
            name="selling_primary_agent"
            control={control}
            render={({ value = [], onChange }) => (
              <DealPrimaryAgent
                isCommissionRequired
                side="Selling"
                title="Enter Listing Agent’s information"
                roles={value}
                onChange={(role, type) =>
                  onChange(getChangedRoles(value, role, type))
                }
                onFinishStep={createInitialDeal}
              />
            )}
          />

          {dealType === 'Buying' && (
            <DealClient
              side="Buying"
              title="Enter buyer information as shown on offer"
              roles={roles}
            />
          )}

          {dealType === 'Selling' && (
            <DealClient
              side="Selling"
              title="Enter the seller’s legal information"
              roles={roles}
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
