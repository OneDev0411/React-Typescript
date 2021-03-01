import React, { useState, useEffect } from 'react'
import { Box, makeStyles, Theme } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { useTitle } from 'react-use'
import { browserHistory } from 'react-router'

import { useForm, Controller } from 'react-hook-form'

import Deal from 'models/Deal'

import {
  createDeal,
  createRoles,
  getContextsByDeal,
  createChecklist,
  updateListing,
  upsertContexts,
  deleteDeal
} from 'actions/deals'

import { QuestionWizard } from 'components/QuestionWizard'

import { IAppState } from 'reducers'
import { selectUser } from 'selectors/user'

import { getDealContexts } from './helpers/get-deal-contexts'
import { getChangedRoles } from './helpers/get-changed-roles'

import { CreateDealIntro } from './form/Intro'
import { DealType } from './form/DealType'
import { DealPropertyType } from './form/DealPropertyType'
import { DealPrimaryAgent } from './form/DealPrimaryAgent'
import { DealAddress, PropertyAddress } from './form/DealAddress'
import { DealClient } from './form/DealClient'
import { DealContext } from './form/DealContext'
import { DealEnderType } from './form/DealEnderType'
import { DealCard } from './form/DealCard'

import { useDealRoles } from './hooks/use-deal-roles'

import { createAddressContext } from '../utils/create-address-context'

import { Context } from './context'

import { Header } from './components/Header'

import type { IDealSide } from './types'

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

  const dealSide = watch('deal_side') as IDealSide
  const dealType: IDealType = dealSide === 'Buying' ? 'Buying' : 'Selling'
  const propertyType = watch('property_type')
  const enderType = watch('ender_type')

  useEffect(() => {
    if (dealId) {
      dispatch(getContextsByDeal(dealId))
    }
  }, [dealId, dispatch])

  const dealContexts = getDealContexts(user, dealType, propertyType)

  const isAgentDoubleEnded = dealSide === 'Both'
  const isOfficeDoubleEnded = enderType === 'OfficeDoubleEnder'
  const isDoubleEnded = isAgentDoubleEnded || isOfficeDoubleEnded

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

    savePropertyAddress(newDeal, values.property_address)
  }

  const savePropertyAddress = async (
    deal: IDeal,
    property: PropertyAddress
  ) => {
    if (property.type === 'Place') {
      const contexts = createAddressContext(deal, property.address)

      dispatch(upsertContexts(deal.id, contexts))
    }

    if (property.type === 'Listing') {
      dispatch(updateListing(deal.id, property.address))
    }
  }

  const handleCancel = async () => {
    if (deal) {
      dispatch(deleteDeal(deal.id))
    }

    browserHistory.goBack()
  }

  return (
    <Context.Provider
      value={{
        deal,
        user
      }}
    >
      <Header
        confirmationMessage="Cancel deal creation?"
        onClose={handleCancel}
      />

      <Box className={classes.root}>
        <QuestionWizard>
          <CreateDealIntro />

          <Controller
            name="property_address"
            control={control}
            render={({ onChange }) => <DealAddress onChange={onChange} />}
          />

          <Controller
            name="property_type"
            control={control}
            render={({ onChange }) => <DealPropertyType onChange={onChange} />}
          />

          <Controller
            key="deal_side"
            name="deal_side"
            control={control}
            render={({ onChange }) => (
              <DealType propertyType={propertyType} onChange={onChange} />
            )}
          />

          {dealType === 'Buying' && (
            <Controller
              key="ender_type"
              name="ender_type"
              control={control}
              render={({ onChange }) => <DealEnderType onChange={onChange} />}
            />
          )}

          {dealType === 'Buying' && (
            <Controller
              key="buying_primary_agent"
              name="buying_primary_agent"
              control={control}
              render={({ value = [], onChange }) => (
                <DealPrimaryAgent
                  side="Buying"
                  isCommissionRequired={isDoubleEnded}
                  isDoubleEnded={isDoubleEnded}
                  dealType={dealType}
                  title={`Who is the ${
                    propertyType?.includes('Lease') ? 'tenant' : 'buyer'
                  } agent?`}
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
                isDoubleEnded={isDoubleEnded}
                dealType={dealType}
                side="Selling"
                title={`Who is the ${
                  propertyType?.includes('Lease') ? 'landlord' : 'seller'
                } agent?`}
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
              key="deal-client-buying"
              side="Buying"
              title={`What's the ${
                propertyType?.includes('Lease') ? 'tenant' : 'buyer'
              }'s legal name?`}
              roles={roles}
              skippable
            />
          )}

          {dealType === 'Selling' && (
            <DealClient
              key="deal-client-selling"
              side="Selling"
              title={`What's the ${
                propertyType?.includes('Lease') ? 'landlord' : 'seller'
              }'s legal name?`}
              roles={roles}
              skippable
            />
          )}

          {deal &&
            dealContexts.map((context: IDealBrandContext) => (
              <DealContext key={context.id} context={context} />
            ))}

          <DealCard dealSide={dealSide} />
        </QuestionWizard>
      </Box>
    </Context.Provider>
  )
}
