import { useState, useEffect } from 'react'

import { Box } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { browserHistory, withRouter, Route, InjectedRouter } from 'react-router'
import { useTitle } from 'react-use'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { getBrandChecklists } from '@app/models/BrandConsole/Checklists'
import {
  createDeal,
  createRoles,
  createChecklist,
  updateListing,
  upsertContexts
} from 'actions/deals'
import { QuestionWizard } from 'components/QuestionWizard'
import { useBrandPropertyTypes } from 'hooks/use-get-brand-property-types'
import { useReduxDispatch } from 'hooks/use-redux-dispatch'
import Deal from 'models/Deal'
import { getDefinitionId } from 'models/Deal/helpers/brand-context/get-definition-id'
import { IAppState } from 'reducers'
import { selectUser } from 'selectors/user'

import { createAddressContext } from '../utils/create-address-context'

import { Header } from './components/Header'
import { Context } from './context'
import { DealAddress, PropertyAddress } from './form/DealAddress'
import { DealCard } from './form/DealCard'
import { DealClient } from './form/DealClient'
import { DealEnderType } from './form/DealEnderType'
import { DealPrimaryAgent } from './form/DealPrimaryAgent'
import { DealPropertyType } from './form/DealPropertyType'
import { DealType } from './form/DealType'
import { CreateDealIntro } from './form/Intro'
import { getChangedRoles } from './helpers/get-changed-roles'
import { useStyles } from './hooks/use-styles'
import type { IDealSide } from './types'

interface DealContext {
  definition: UUID
  checklist: UUID
  value: string
  approved: boolean
}
interface Props {
  router: InjectedRouter
  route: Route
}

function CreateDeal({ router, route }: Props) {
  useTitle('Create New Deal | Deals | Rechat')

  const classes = useStyles()
  const { control, watch } = useForm()
  const activeBrandId = useActiveBrandId()
  const [dealId, setDealId] = useState<UUID | null>(null)
  const [isCreatingDeal, setIsCreatingDeal] = useState(false)

  const dispatch = useReduxDispatch()
  const user = useSelector<IAppState, IUser>(selectUser)
  const deal = useSelector<IAppState, IDeal | null>(({ deals }) =>
    dealId ? deals.list[dealId] : null
  )

  const { propertyTypes: brandPropertyTypes } =
    useBrandPropertyTypes(activeBrandId)

  const dealSide = watch('deal_side') as IDealSide
  const dealType: IDealType = dealSide === 'Buying' ? 'Buying' : 'Selling'
  const propertyTypeId = watch('property_type')
  const enderType = watch('ender_type')
  const propertyType = brandPropertyTypes.find(
    ({ id }) => id === propertyTypeId
  )

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

    const newDeal: IDeal = await Deal.create({
      brand: agent!.brand,
      property_type: propertyType?.id,
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

    const brandChecklists = await getBrandChecklists(newDeal.brand.id)

    if (values.property_address) {
      savePropertyAddress(
        newDeal,
        brandChecklists,
        checklist,
        values.property_address
      )
    }

    saveContexts(newDeal, brandChecklists, checklist)

    setIsCreatingDeal(false)
  }

  const saveContexts = (
    deal: IDeal,
    brandChecklists: IBrandChecklist[],
    checklist: IDealChecklist
  ) => {
    const contexts: DealContext[] = []

    if (deal.deal_type === 'Selling') {
      const definition = getDefinitionId(
        deal,
        brandChecklists,
        'listing_status'
      )

      definition &&
        contexts.push({
          definition,
          checklist: checklist.id,
          value: deal.property_type.is_lease ? 'Lease' : 'Active',
          approved: true
        })
    }

    if (isDoubleEnded) {
      const definition = getDefinitionId(deal, brandChecklists, 'ender_type')

      definition &&
        contexts.push({
          definition,
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
    brandChecklists: IBrandChecklist[],
    checklist: IDealChecklist,
    property: PropertyAddress
  ) => {
    if (property.type === 'Place') {
      const contexts = createAddressContext(
        deal,
        brandChecklists,
        [checklist],
        property.address
      )

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
