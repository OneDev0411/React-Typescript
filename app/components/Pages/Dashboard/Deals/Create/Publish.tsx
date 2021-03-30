import React, { useState, useMemo, useEffect } from 'react'
import { Box, Button, CircularProgress, Typography } from '@material-ui/core'
import { useTitle } from 'react-use'
import { useSelector, useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'

import { QuestionWizard } from 'components/QuestionWizard'
import { addNotification as notify } from 'components/notification'

import { publishDeal } from 'actions/deals'

import { IAppState } from 'reducers'
import { selectUser } from 'selectors/user'

import { selectDealById } from 'reducers/deals/list'
import { selectDealRoles } from 'reducers/deals/roles'
import { useLoadFullDeal } from 'hooks/use-load-deal'

import { goTo } from 'utils/go-to'

import { getField } from 'models/Deal/helpers/context'

import { getDealContexts } from './helpers/get-deal-contexts'

import { DealContext } from './form/DealContext'
import { DealClient } from './form/DealClient'
import { DealStatus } from './form/DealStatus'
import { DealAddress } from './form/DealAddress'

import { Header } from './components/Header'

import { useStatusList } from './hooks/use-brand-status-list'
import { useStyles } from './hooks/use-styles'
import { showStatusQuestion } from './helpers/show-status-question'
import { getChangedRoles } from './helpers/get-changed-roles'

import { Context } from './context'

interface Props {
  params: {
    id: UUID
  }
}

export default function Publish({ params }: Props) {
  useTitle('Publish Draft Deal | Deals | Rechat')

  const { control } = useForm()
  const classes = useStyles()

  const dispatch = useDispatch()
  const { isFetchingCompleted } = useLoadFullDeal(params.id)

  const [isPublishing, setIsPublishing] = useState(false)
  const user = useSelector<IAppState, IUser>(state => selectUser(state))
  const deal = useSelector<IAppState, IDeal>(({ deals }) =>
    selectDealById(deals.list, params.id)
  )

  const statusList = useStatusList(deal)

  useEffect(() => {
    if (deal?.is_draft === false) {
      goTo(`/dashboard/deals/${deal.id}`)
    }
  }, [deal])

  const propertyType = deal?.property_type
  const hasAddress = deal?.listing || getField(deal, 'full_address')

  const contexts = useMemo(() => {
    return deal ? getDealContexts(user, deal.deal_type, deal.property_type) : []
  }, [deal, user])

  const roles = useSelector<IAppState, IDealRole[]>(({ deals }) =>
    selectDealRoles(deals.roles, deal)
  )

  const handlePublish = async () => {
    const values = control.getValues()

    console.log(values)
    // try {
    //   setIsPublishing(true)
    //   await dispatch(publishDeal(deal.id))

    //   dispatch(
    //     notify({
    //       status: 'success',
    //       message: 'The deal is published.'
    //     })
    //   )

    //   goTo(`/dashboard/deals/${deal.id}`)
    // } catch (e) {
    //   console.log(e)
    // } finally {
    //   setIsPublishing(false)
    // }
  }

  if (!isFetchingCompleted || isPublishing) {
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
            {!isFetchingCompleted && <>Loading</>}
            {isPublishing && <>Publishing Deal</>}
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
        title="Make Visible To Admin"
        confirmationMessage="Cancel deal publish?"
        onClose={() => goTo(`/dashboard/deals/${deal.id}`)}
      />

      <Box className={classes.root}>
        <QuestionWizard
          concurrent
          useWindowScrollbar
          questionPositionOffset={80}
        >
          {!hasAddress && (
            <Controller
              name="address"
              control={control}
              render={({ onChange }) => (
                <DealAddress
                  concurrentMode
                  skippable={false}
                  onChange={onChange}
                />
              )}
            />
          )}

          {deal.deal_type === 'Buying' && (
            <Controller
              name="buying_clients"
              control={control}
              render={({ value = [], onChange }) => (
                <DealClient
                  concurrentMode
                  side="Buying"
                  propertyType={deal.property_type}
                  title={
                    <div>
                      What's the{' '}
                      <span className={classes.brandedTitle}>
                        {propertyType?.includes('Lease') ? 'Tenant' : 'Buyer'}'s
                        Legal Name
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

          <Controller
            name="selling_clients"
            control={control}
            render={({ value = [], onChange }) => (
              <DealClient
                concurrentMode
                side="Selling"
                propertyType={deal.property_type}
                title={
                  <div>
                    What's the{' '}
                    <span className={classes.brandedTitle}>
                      {propertyType?.includes('Lease') ? 'Landlord' : 'Seller'}
                      's Legal Name
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

          {deal &&
            showStatusQuestion(
              deal,
              deal.deal_type,
              deal.deal_type === 'Selling'
                ? 'listing_status'
                : 'contract_status'
            ) &&
            statusList.length > 1 && (
              <Controller
                name="context:status"
                control={control}
                render={({ onChange }) => (
                  <DealStatus list={statusList} onChange={onChange} />
                )}
              />
            )}

          {contexts.length > 0 &&
            contexts.map((context: IDealBrandContext) => (
              <Controller
                key={context.id}
                name={`context:${context.key}`}
                control={control}
                render={({ onChange }) => (
                  <DealContext
                    concurrentMode
                    context={context}
                    onChange={onChange}
                  />
                )}
              />
            ))}
        </QuestionWizard>

        <Box textAlign="right" mt={8}>
          <Button color="secondary" variant="contained" onClick={handlePublish}>
            Make Visible to Admin
          </Button>
        </Box>
      </Box>
    </Context.Provider>
  )
}
