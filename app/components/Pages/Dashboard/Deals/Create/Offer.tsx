import React, { useState, useEffect } from 'react'
import {
  Box,
  CircularProgress,
  Typography,
  makeStyles
} from '@material-ui/core'

import { useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'

import { IAppState } from 'reducers'
import { useReduxDispatch } from 'hooks/use-redux-dispatch'

import { useLoadFullDeal } from 'hooks/use-load-deal'
import { selectDealById } from 'reducers/deals/list'
import { createOffer, createRoles, upsertContexts } from 'actions/deals'

import { QuestionWizard } from 'components/QuestionWizard'

import { goTo } from 'utils/go-to'

import { getLegalFullName } from 'deals/utils/roles'
import Deal from 'models/Deal'
import { getDefinitionId } from 'models/Deal/helpers/dynamic-context'

import { getDealContexts } from './helpers/get-deal-contexts'
import { getChangedRoles } from './helpers/get-changed-roles'

import { DealClient } from './form/DealClient'
import { DealEnderType } from './form/DealEnderType'
import { DealPrimaryAgent } from './form/DealPrimaryAgent'
import { DealCoAgent } from './form/DealCoAgent'
import { DealStatus } from './form/DealStatus'
import { DealContext } from './form/DealContext'
import { Header } from './components/Header'

import { useStatusList } from './hooks/use-deal-status-list'
import { useDealRoles } from './hooks/use-deal-roles'
import { showStatusQuestion } from './helpers/show-status-question'

import { Context } from './context'

const useStyles = makeStyles(
  () => ({
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

interface Props {
  params: {
    id: UUID
  }
}

export default function CreateOffer({ params }: Props) {
  const classes = useStyles()
  const { control, watch } = useForm()
  const { isFetchingCompleted } = useLoadFullDeal(params.id)

  const [isCreatingOffer, setIsCreatingOffer] = useState(false)

  const dispatch = useReduxDispatch()
  const user = useSelector<IAppState, IUser>(({ user }) => user!)

  const deal = useSelector<IAppState, IDeal>(({ deals }) =>
    selectDealById(deals.list, params.id)
  )

  const statusList = useStatusList(deal)

  useEffect(() => {
    deal?.has_active_offer && goTo(`/dashboard/deals/${deal.id}`)
  }, [deal?.has_active_offer, deal?.id])

  const propertyType = deal?.property_type
  const roles = useDealRoles(deal)

  const dealContexts = deal
    ? getDealContexts(user, 'Buying', deal.property_type, true)
    : []

  const isDoubleEnded = watch('context:ender_type') === 'OfficeDoubleEnder'

  const getContexts = (
    values: Record<string, unknown>,
    deal: IDeal,
    checklist: IDealChecklist
  ) => {
    return Object.entries(values).reduce((acc, [key, value]) => {
      if (key.includes('context') === false) {
        return acc
      }

      const name = key.split(':')[1]
      const context = Deal.get.context(deal, key)

      return [
        ...acc,
        {
          value,
          definition: getDefinitionId(deal.id, name),
          checklist: checklist.id,
          approved: context ? context.needs_approval : false
        }
      ]
    }, [])
  }

  const createOfferChecklist = async () => {
    const values = control.getValues()

    const clients = values.clients as IDealRole[]
    const agents = [].concat(
      values.primary_agent,
      values.co_agents
    ) as IDealRole[]

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
        checklist: checklist.id
      }))

      await Promise.all([
        dispatch(createRoles(deal.id, roles)),
        dispatch(upsertContexts(deal.id, getContexts(values, deal, checklist)))
      ])
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
        confirmationMessage="Cancel offer creation?"
        onClose={() => goTo(`/dashboard/deals/${deal.id}`)}
      />

      <Box className={classes.root}>
        <QuestionWizard onFinish={createOfferChecklist}>
          <Controller
            name="clients"
            control={control}
            render={({ value = [], onChange }) => (
              <DealClient
                side="Buying"
                title={`Enter ${
                  propertyType?.includes('Lease') ? 'tenant' : 'buyer'
                } information as shown on offer`}
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
            render={({ onChange }) => <DealEnderType onChange={onChange} />}
          />

          <Controller
            name="primary_agent"
            control={control}
            render={({ value = [], onChange }) => (
              <DealPrimaryAgent
                side="Buying"
                isCommissionRequired={isDoubleEnded}
                isDoubleEnded={isDoubleEnded}
                dealType="Buying"
                title={`Who is the ${
                  propertyType?.includes('Lease') ? 'tenant' : 'buyer'
                } agent?`}
                roles={roles.concat(value)}
                onChange={(role, type) =>
                  onChange(getChangedRoles(value, role, type))
                }
              />
            )}
          />

          <Controller
            name="co_agents"
            control={control}
            render={({ value = [], onChange }) => (
              <DealCoAgent
                side="Buying"
                isCommissionRequired={isDoubleEnded}
                title={`Who is the ${
                  propertyType?.includes('Lease') ? 'tenant' : 'buyer'
                } co agent?`}
                roles={roles.concat(value)}
                onChange={(role, type) =>
                  onChange(getChangedRoles(value, role, type))
                }
              />
            )}
          />

          {showStatusQuestion(deal, 'Buying', 'contract_status') && (
            <Controller
              name="context:status"
              control={control}
              render={({ onChange }) => (
                <DealStatus list={statusList} onChange={onChange} />
              )}
            />
          )}

          {dealContexts.map((context: IDealBrandContext) => (
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
