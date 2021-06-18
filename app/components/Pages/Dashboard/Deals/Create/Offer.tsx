import React, { useState, useEffect } from 'react'
import { Box, CircularProgress, Typography } from '@material-ui/core'

import { useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { withRouter, Route, InjectedRouter } from 'react-router'
import { useTitle } from 'react-use'

import { IAppState } from 'reducers'
import { useReduxDispatch } from 'hooks/use-redux-dispatch'

import { useLoadFullDeal } from 'hooks/use-load-deal'
import { selectDealById } from 'reducers/deals/list'
import { createOffer, createRoles, upsertContexts } from 'actions/deals'

import { QuestionWizard } from 'components/QuestionWizard'
import { normalizeForm as normalizeRole } from 'components/DealRole/helpers/normalize-form'
import { goTo } from 'utils/go-to'

import { getLegalFullName } from 'deals/utils/roles'
import { getDealChecklists } from 'reducers/deals/checklists'
import { useDealStatuses } from 'hooks/use-deal-statuses'

import {
  getBrandChecklistRequiredContexts,
  getBrandChecklistsById
} from 'reducers/deals/brand-checklists'

import { getChangedRoles } from './helpers/get-changed-roles'
import { getFormContexts } from './helpers/get-form-contexts'

import { DealClient } from './form/DealClient'
import { OfferEnderType } from './form/OfferEnderType'
import { DealPrimaryAgent } from './form/DealPrimaryAgent'
import { DealCoAgent } from './form/DealCoAgent'
import { DealStatus } from './form/DealStatus'
import { DealContext } from './form/DealContext'
import { Header } from './components/Header'

import { useDealRoles } from './hooks/use-deal-roles'
import { useStyles } from './hooks/use-styles'
import { showStatusQuestion } from './helpers/show-status-question'

import { Context } from './context'

interface Props {
  router: InjectedRouter
  route: Route
  params: {
    id: UUID
  }
}

function CreateOffer({ router, route, params }: Props) {
  useTitle('Create New Offer | Deals | Rechat')

  const classes = useStyles()
  const { control, watch } = useForm()
  const { isFetchingCompleted } = useLoadFullDeal(params.id)

  const [isCreatingOffer, setIsCreatingOffer] = useState(false)

  const dispatch = useReduxDispatch()
  const user = useSelector<IAppState, IUser>(({ user }) => user!)

  const deal = useSelector<IAppState, IDeal>(({ deals }) =>
    selectDealById(deals.list, params.id)
  )

  const statusList = useDealStatuses(deal, 'Offer')

  useEffect(() => {
    router.setRouteLeaveHook(route, () => {
      if (!deal.has_active_offer) {
        return 'By canceling you will lose your work. Continue?'
      }
    })
  }, [deal?.has_active_offer, router, route])

  useEffect(() => {
    deal?.has_active_offer &&
      !isCreatingOffer &&
      goTo(`/dashboard/deals/${deal.id}`)
  }, [deal?.has_active_offer, deal?.id, isCreatingOffer])

  const propertyType = deal?.property_type
  const roles = useDealRoles(deal)

  const { checklists, brandChecklists } = useSelector(
    ({ deals }: IAppState) => ({
      brandChecklists: deal
        ? getBrandChecklistsById(deals.brandChecklists, deal.brand.id)
        : [],
      checklists: getDealChecklists(deal, deals.checklists)
    })
  )

  const requiredContexts = useSelector<
    IAppState,
    IBrandChecklist['required_contexts']
  >(({ deals }) => {
    return deal
      ? getBrandChecklistRequiredContexts(
          deals.brandChecklists,
          deal.brand.id,
          deal.property_type?.id,
          'Offer'
        ).filter(
          context =>
            ['listing_status', 'contract_status'].includes(context.key) ===
            false
        )
      : []
  })

  const isAgentDoubleEnded = watch('context:ender_type') === 'AgentDoubleEnder'
  const isOfficeDoubleEnded =
    watch('context:ender_type') === 'OfficeDoubleEnder'

  const isDoubleEnded = isOfficeDoubleEnded || isAgentDoubleEnded
  const sellerAgent = roles.find(item => item.role === 'SellerAgent')

  const createOfferChecklist = async () => {
    const values = control.getValues()

    const clients = values.clients as IDealRole[]
    const agents = [].concat(
      values.primary_agent || [],
      values.co_agents || []
    ) as IDealRole[]

    if (values['context:ender_type'] === 'AgentDoubleEnder') {
      agents.push({
        ...(normalizeRole(sellerAgent!) as IDealRole),
        role: 'BuyerAgent'
      })
    }

    const checklistName = clients.map(role => getLegalFullName(role)).join(', ')

    try {
      setIsCreatingOffer(true)

      const checklist = await dispatch(
        createOffer(deal, {
          name: checklistName,
          order: -1,
          is_deactivated: false
        })
      )

      const roles = agents.concat(clients).map(role => ({
        ...role,
        id: undefined,
        contact: undefined,
        checklist: checklist.id
      }))

      await Promise.all([
        dispatch(createRoles(deal.id, roles)),
        dispatch(
          upsertContexts(
            deal.id,
            getFormContexts(
              values,
              deal,
              brandChecklists,
              checklists,
              'Offer'
            ).map(context => ({
              ...context,
              checklist: checklist.id
            }))
          )
        )
      ])

      goTo(`/dashboard/deals/${deal.id}`)
    } catch (e) {
      console.log(e)
    } finally {
      setIsCreatingOffer(false)
    }
  }

  if (isCreatingOffer || !isFetchingCompleted) {
    return (
      <Box
        width="100%"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />

        <Box mt={2}>
          <Typography variant="subtitle1">
            {!isFetchingCompleted && <>Loading...</>}
            {isCreatingOffer && <>Creating Offer...</>}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Context.Provider
      value={{
        user
      }}
    >
      <Header
        title="Create New Offer"
        confirmationMessage="Cancel offer creation?"
        onClose={() => goTo(`/dashboard/deals/${deal.id}`)}
      />

      <Box className={classes.root}>
        <QuestionWizard
          useWindowScrollbar
          questionPositionOffset={80}
          styles={{
            paddingBottom: '50%'
          }}
          onFinish={createOfferChecklist}
        >
          <Controller
            name="clients"
            control={control}
            render={({ value = [], onChange }) => (
              <DealClient
                side="Buying"
                propertyType={deal.property_type}
                title={
                  <div>
                    Enter{' '}
                    <span className={classes.brandedTitle}>
                      {propertyType?.is_lease ? 'Tenant' : 'Buyer'}
                    </span>{' '}
                    information as shown on offer
                  </div>
                }
                predefinedRoles={roles}
                roles={value}
                onChange={(role, type) =>
                  onChange(getChangedRoles(value, role, type))
                }
              />
            )}
          />

          <Controller
            name="context:ender_type"
            control={control}
            render={({ onChange }) => (
              <OfferEnderType sellerAgent={sellerAgent} onChange={onChange} />
            )}
          />

          {!isAgentDoubleEnded && (
            <Controller
              name="primary_agent"
              control={control}
              render={({ value = [], onChange }) => (
                <DealPrimaryAgent
                  side="Buying"
                  shouldPickRoleFromContacts={!isDoubleEnded}
                  isCommissionRequired={isOfficeDoubleEnded}
                  isOfficeDoubleEnded={isOfficeDoubleEnded}
                  title={
                    <div>
                      Who is the{' '}
                      <span className={classes.brandedTitle}>
                        {propertyType?.is_lease ? 'Tenant' : 'Buyer'} Agent
                      </span>
                      ?
                    </div>
                  }
                  roles={roles.concat(value)}
                  onChange={(role, type) =>
                    onChange(getChangedRoles(value, role, type))
                  }
                />
              )}
            />
          )}

          <Controller
            name="co_agents"
            control={control}
            render={({ value = [], onChange }) => (
              <DealCoAgent
                side="Buying"
                isCommissionRequired={isDoubleEnded}
                title={
                  <div>
                    Who is the{' '}
                    <span className={classes.brandedTitle}>
                      {propertyType?.is_lease ? 'Tenant' : 'Buyer'} Co Agent
                    </span>
                    ?
                  </div>
                }
                roles={roles.concat(value)}
                onChange={(role, type) =>
                  onChange(getChangedRoles(value, role, type))
                }
              />
            )}
          />

          {showStatusQuestion(deal, brandChecklists, 'contract_status') && (
            <Controller
              name="context:contract_status"
              control={control}
              render={({ onChange }) => (
                <DealStatus list={statusList} onChange={onChange} />
              )}
            />
          )}

          {requiredContexts.map((context: IDealBrandContext) => (
            <Controller
              key={context.id}
              name={`context:${context.key}`}
              control={control}
              render={({ onChange }) => (
                <DealContext context={context} onChange={onChange} />
              )}
            />
          ))}
        </QuestionWizard>
      </Box>
    </Context.Provider>
  )
}

export default withRouter(CreateOffer)
