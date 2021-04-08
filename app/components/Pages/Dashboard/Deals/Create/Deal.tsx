import React, { useState, useEffect } from 'react'
import { Box } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { useTitle } from 'react-use'
import { useForm, Controller } from 'react-hook-form'
import { browserHistory, withRouter, Route, InjectedRouter } from 'react-router'

import Deal from 'models/Deal'

import {
  createDeal,
  createRoles,
  getContextsByDeal,
  createChecklist,
  updateListing,
  upsertContexts
} from 'actions/deals'

import { QuestionWizard } from 'components/QuestionWizard'

import { IAppState } from 'reducers'
import { selectUser } from 'selectors/user'
import { useReduxDispatch } from 'hooks/use-redux-dispatch'

import { useBrandPropertyTypes } from 'hooks/use-get-brand-property-types'
import { getActiveTeamId } from 'utils/user-teams'

import { getDefinitionId } from 'models/Deal/helpers/dynamic-context'

import { getChangedRoles } from './helpers/get-changed-roles'

import { CreateDealIntro } from './form/Intro'
import { DealType } from './form/DealType'
import { DealPropertyType } from './form/DealPropertyType'
import { DealPrimaryAgent } from './form/DealPrimaryAgent'
import { DealAddress, PropertyAddress } from './form/DealAddress'
import { DealClient } from './form/DealClient'
import { DealEnderType } from './form/DealEnderType'
import { DealCard } from './form/DealCard'

import { useStyles } from './hooks/use-styles'

import { createAddressContext } from '../utils/create-address-context'

import { Header } from './components/Header'

import { Context } from './context'
import type { IDealSide } from './types'

interface Props {
  router: InjectedRouter
  route: Route
}

function CreateDeal({ router, route }: Props) {
  useTitle('Create New Deal | Deals | Rechat')

  const classes = useStyles()
  const { control, watch } = useForm()

  const [dealId, setDealId] = useState<UUID | null>(null)
  const [isCreatingDeal, setIsCreatingDeal] = useState(false)

  const dispatch = useReduxDispatch()
  const user = useSelector<IAppState, IUser>(state => selectUser(state))
  const deal = useSelector<IAppState, IDeal | null>(({ deals }) =>
    dealId ? deals.list[dealId] : null
  )

  const brandPropertyTypes = useBrandPropertyTypes(getActiveTeamId(user)!)
  const dealSide = watch('deal_side') as IDealSide
  const dealType: IDealType = dealSide === 'Buying' ? 'Buying' : 'Selling'
  const propertyTypeId = watch('property_type')
  const enderType = watch('ender_type')
  const propertyType = brandPropertyTypes
    ? brandPropertyTypes.find(({ id }) => id === propertyTypeId)
    : propertyTypeId

  useEffect(() => {
    if (dealId) {
      dispatch(getContextsByDeal(dealId))
    }
  }, [dealId, dispatch])

  useEffect(() => {
    router.setRouteLeaveHook(route, () => {
      if (!deal) {
        return 'By canceling you will lose your work. Continue?'
      }
    })
  }, [deal, router, route])

  const isAgentDoubleEnded = dealSide === 'Both'
  const isOfficeDoubleEnded = enderType === 'OfficeDoubleEnder'
  const isDoubleEnded = isAgentDoubleEnded || isOfficeDoubleEnded

  /**
   * Creates the initial deal as soon as possible and updates
   * the created deal on every step change
   *
   * @param agents - The list of primary agents [BuyerAgent, SellerAgent]
   */
  const createDraftDeal = async () => {
    if (deal || isCreatingDeal) {
      return
    }

    const values = control.getValues()

    const roles = [].concat(
      values.buying_primary_agent || [],
      values.selling_primary_agent || [],
      values.clients || []
    ) as IDealRole[]

    const agent = roles.find(agent => {
      const primaryAgent = dealType === 'Buying' ? 'BuyerAgent' : 'SellerAgent'

      return agent.role === primaryAgent
    })

    setIsCreatingDeal(true)

    const newDeal: IDeal = await Deal.create(user, {
      brand: agent!.brand,
      property_type: propertyType,
      deal_type: dealType,
      is_draft: true
    })

    dispatch(createDeal(newDeal))
    setDealId(newDeal.id)

    const primaryAgents = roles.map(role => ({
      ...role,
      id: undefined,
      contact: undefined
    }))

    const [, checklist] = await Promise.all([
      dispatch(createRoles(newDeal.id, primaryAgents)),
      dispatch(
        createChecklist(newDeal.id, {
          conditions: {
            checklist_type: newDeal.deal_type,
            property_type: newDeal.property_type.id
          }
        })
      )
    ])

    newDeal.checklists = [checklist.id]

    if (values.property_address) {
      savePropertyAddress(newDeal, values.property_address)
    }

    saveContexts(newDeal, checklist)

    setIsCreatingDeal(false)
  }

  const saveContexts = (deal: IDeal, checklist: IDealChecklist) => {
    const contexts: IDealContext[] = []

    if (deal.deal_type === 'Selling') {
      const defaultStatus = deal.property_type.is_lease ? 'Lease' : 'Active'

      contexts.push({
        definition: getDefinitionId(deal.id, 'listing_status'),
        checklist: checklist.id,
        value: defaultStatus,
        approved: true
      })
    }

    if (isDoubleEnded) {
      contexts.push({
        definition: getDefinitionId(deal.id, 'ender_type'),
        checklist: checklist.id,
        value: isAgentDoubleEnded ? 'AgentDoubleEnder' : 'OfficeDoubleEnder',
        approved: true
      })
    }

    if (contexts.length > 0) {
      dispatch(upsertContexts(deal.id, contexts))
    }
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
    browserHistory.goBack()
  }

  const getClientTitle = () => {
    const type =
      dealType === 'Selling'
        ? propertyType?.is_lease
          ? 'Landlord'
          : 'Seller'
        : propertyType?.is_lease
        ? 'Tenant'
        : 'Buyer'

    return (
      <div>
        What is the{' '}
        <span className={classes.brandedTitle}>{type}'s Legal Name</span>?
      </div>
    )
  }

  return (
    <Context.Provider
      value={{
        deal,
        user,
        propertyTypes: brandPropertyTypes
      }}
    >
      <Header
        title="Create New Deal"
        confirmationMessage="Cancel deal creation?"
        onClose={handleCancel}
      />

      <Box className={classes.root}>
        <QuestionWizard
          useWindowScrollbar
          questionPositionOffset={80}
          onFinish={createDraftDeal}
          styles={{
            paddingBottom: '50%'
          }}
        >
          <CreateDealIntro />

          <Controller
            name="property_address"
            control={control}
            render={({ onChange }) => (
              <DealAddress skippable onChange={onChange} />
            )}
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
              key="buying_primary_agent"
              name="buying_primary_agent"
              control={control}
              render={({ value = [], onChange }) => (
                <DealPrimaryAgent
                  side="Buying"
                  isCommissionRequired
                  title={
                    <div>
                      Who is the{' '}
                      <span className={classes.brandedTitle}>
                        {propertyType?.is_lease ? 'Tenant' : 'Buyer'} Agent
                      </span>
                      ?
                    </div>
                  }
                  roles={value}
                  onChange={(role, type) =>
                    onChange(getChangedRoles(value, role, type))
                  }
                />
              )}
            />
          )}

          {dealType === 'Buying' && (
            <Controller
              key="ender_type"
              name="ender_type"
              control={control}
              render={({ onChange }) => <DealEnderType onChange={onChange} />}
            />
          )}

          <Controller
            name="selling_primary_agent"
            control={control}
            render={({ value = [], onChange }) => (
              <DealPrimaryAgent
                isCommissionRequired
                isOfficeDoubleEnded={isOfficeDoubleEnded}
                side="Selling"
                skippable={dealType === 'Buying'}
                shouldPickRoleFromContacts={
                  dealType === 'Buying' && !isDoubleEnded
                }
                title={
                  <div>
                    Who is the{' '}
                    <span className={classes.brandedTitle}>
                      {propertyType?.is_lease ? "Landlord's" : "Seller's"} Agent
                    </span>
                    ?
                  </div>
                }
                roles={value}
                onChange={(role, type) =>
                  onChange(getChangedRoles(value, role, type))
                }
              />
            )}
          />

          <Controller
            name="clients"
            control={control}
            render={({ value = [], onChange }) => (
              <DealClient
                side={dealType}
                propertyType={propertyType}
                title={getClientTitle()}
                roles={value}
                onChange={(role, type) =>
                  onChange(getChangedRoles(value, role, type))
                }
                skippable
              />
            )}
          />

          <DealCard dealSide={dealSide} isCreatingDeal={isCreatingDeal} />
        </QuestionWizard>
      </Box>
    </Context.Provider>
  )
}

export default withRouter(CreateDeal)
