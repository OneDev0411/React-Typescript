import { useState, useEffect } from 'react'
import { Box, Button, CircularProgress, Typography } from '@material-ui/core'
import { useTitle } from 'react-use'
import { useSelector, useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'

import { QuestionWizard } from 'components/QuestionWizard'
import { addNotification as notify } from 'components/notification'

import {
  createRoles,
  publishDeal,
  updateListing,
  upsertContexts
} from 'actions/deals'

import { IAppState } from 'reducers'
import { selectUser } from 'selectors/user'

import { selectDealById } from 'reducers/deals/list'
import { selectDealRoles } from 'reducers/deals/roles'
import { useLoadFullDeal } from 'hooks/use-load-deal'

import { goTo } from 'utils/go-to'

import { getField } from 'models/Deal/helpers/context'

import { createAddressContext } from 'deals/utils/create-address-context'

import { getDealContexts } from './helpers/get-deal-contexts'
import { BUYER_ROLES, SELLER_ROLES } from './helpers/roles'

import { DealContext } from './form/DealContext'
import { DealClient } from './form/DealClient'
import { DealStatus } from './form/DealStatus'
import { DealAddress, PropertyAddress } from './form/DealAddress'

import { Header } from './components/Header'

import { useStatusList } from './hooks/use-brand-status-list'
import { useStyles } from './hooks/use-styles'
import { showStatusQuestion } from './helpers/show-status-question'
import { getChangedRoles } from './helpers/get-changed-roles'
import { getFormContexts } from './helpers/get-form-contexts'

import { Context } from './context'

type FormValues = {
  buying_clients: IDealRole[]
  selling_clients: IDealRole[]
  address: PropertyAddress
} & Record<string, unknown>

interface Props {
  params: {
    id: UUID
  }
}

export default function Publish({ params }: Props) {
  useTitle('Publish Draft Deal | Deals | Rechat')

  const { control, watch, handleSubmit, formState } = useForm()
  const classes = useStyles()

  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const dispatch = useDispatch()
  const { isFetchingCompleted } = useLoadFullDeal(params.id)
  const user = useSelector<IAppState, IUser>(state => selectUser(state))
  const deal = useSelector<IAppState, IDeal>(({ deals }) =>
    selectDealById(deals.list, params.id)
  )

  const statusList = useStatusList(deal)
  const statusContextKey =
    deal?.deal_type === 'Buying' ? 'contract_status' : 'listing_status'

  const isStatusVisible =
    deal && showStatusQuestion(deal, deal?.deal_type, statusContextKey)

  useEffect(() => {
    if (deal?.is_draft === false) {
      goTo(`/dashboard/deals/${deal.id}`)
    }
  }, [deal])

  const propertyType = deal?.property_type
  const hasAddress = deal?.listing || getField(deal, 'full_address')

  const contexts = deal
    ? getDealContexts(deal, deal.deal_type, deal.property_type)
    : []

  const roles = useSelector<IAppState, IDealRole[]>(({ deals }) =>
    selectDealRoles(deals.roles, deal)
  )

  const sellerRoles = roles
    ? roles.filter(item => SELLER_ROLES.includes(item.role))
    : []
  const buyerRoles = roles
    ? roles.filter(item => BUYER_ROLES.includes(item.role))
    : []

  const validate = () => {
    const errors: Record<keyof FormValues, string> = {}

    if (!deal) {
      return errors
    }

    const buyingClients = watch('buying_clients') || buyerRoles
    const sellingClients = watch('selling_clients') || sellerRoles
    const address =
      watch('address') || deal?.listing || getField(deal, 'full_address')
    const status =
      watch(`context:${statusContextKey}`) || getField(deal, statusContextKey)

    if (!address) {
      errors.address = 'Address is required'
    }

    if (
      deal.deal_type === 'Buying' &&
      (!buyingClients || buyingClients.length === 0)
    ) {
      errors.buying_clients = 'Buyer Legal Names is required'
    }

    if (!sellingClients || sellingClients.length === 0) {
      errors.selling_clients = 'Seller Legal Names is required'
    }

    if (isStatusVisible && !status) {
      errors.status = 'Status is required'
    }

    contexts
      .filter(context => {
        const value = watch(`context:${context.key}`)

        return value == null || value === ''
      })
      .forEach(context => {
        errors[context.key] = `${context.label} is required`
      })

    return errors
  }

  const saveForm = async (
    values = control.getValues() as FormValues,
    showNotification = true
  ) => {
    const roles = ([] as IDealRole[]).concat(
      values.selling_clients || [],
      values.buying_clients || []
    )

    try {
      setIsSaving(true)

      await dispatch(upsertContexts(deal.id, getFormContexts(values, deal)))

      if (values.address) {
        await savePropertyAddress(deal, values.address)
      }

      if (roles.length > 0) {
        await dispatch(createRoles(deal.id, roles))
      }

      showNotification &&
        dispatch(
          notify({
            status: 'success',
            message: 'The form is saved.'
          })
        )
    } catch (e) {
      console.log(e)
    } finally {
      setIsSaving(false)
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

  const handlePublish = async (values: FormValues) => {
    if (Object.keys(validate()).length > 0) {
      dispatch(
        notify({
          status: 'error',
          message: 'Please complete all required fields'
        })
      )

      return
    }

    try {
      setIsPublishing(true)

      await Promise.all([
        await saveForm(values, false),
        await dispatch(publishDeal(deal.id))
      ])

      dispatch(
        notify({
          status: 'success',
          message: 'The deal is published.'
        })
      )

      goTo(`/dashboard/deals/${deal.id}`)
    } catch (e) {
      console.log(e)
    } finally {
      setIsPublishing(false)
    }
  }

  const errors = formState.isSubmitted ? validate() : {}

  if (!isFetchingCompleted) {
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
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Context.Provider
      value={{
        deal,
        user
      }}
    >
      <form>
        <Header
          title="Make Visible To Admin"
          confirmationMessage="Cancel deal publish?"
          disableClose={isSaving || isPublishing}
          actions={
            <>
              <Button
                color="secondary"
                variant="outlined"
                disabled={isSaving || isPublishing}
                onClick={() => saveForm()}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </>
          }
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
                key="address"
                name="address"
                control={control}
                render={({ onChange }) => (
                  <DealAddress
                    concurrentMode
                    error={errors.address}
                    skippable={false}
                    onChange={onChange}
                  />
                )}
              />
            )}

            {deal.deal_type === 'Buying' && buyerRoles.length === 0 && (
              <Controller
                key="buyers"
                name="buying_clients"
                control={control}
                render={({ value = [], onChange }) => (
                  <DealClient
                    concurrentMode
                    error={errors.buying_clients}
                    side="Buying"
                    propertyType={deal.property_type}
                    title={
                      <div>
                        What's the{' '}
                        <span className={classes.brandedTitle}>
                          {propertyType?.includes('Lease') ? 'Tenant' : 'Buyer'}
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
            )}

            {sellerRoles.length === 0 && (
              <Controller
                key="sellers"
                name="selling_clients"
                control={control}
                render={({ value = [], onChange }) => (
                  <DealClient
                    concurrentMode
                    side="Selling"
                    error={errors.selling_clients}
                    propertyType={deal.property_type}
                    title={
                      <div>
                        What's the{' '}
                        <span className={classes.brandedTitle}>
                          {propertyType?.includes('Lease')
                            ? 'Landlord'
                            : 'Seller'}
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
            )}

            {isStatusVisible && !getField(deal, statusContextKey) && (
              <Controller
                key="status"
                name={`context:${statusContextKey}`}
                control={control}
                defaultValue={getField(deal, statusContextKey)}
                render={({ onChange }) => (
                  <DealStatus
                    list={statusList}
                    error={errors.status}
                    onChange={onChange}
                  />
                )}
              />
            )}

            {contexts.length > 0 &&
              contexts.map((context: IDealBrandContext) => (
                <Controller
                  key={context.id}
                  name={`context:${context.key}`}
                  control={control}
                  defaultValue={getField(deal, context.key)}
                  render={({ onChange }) => (
                    <DealContext
                      concurrentMode
                      error={errors[context.key]}
                      context={context}
                      onChange={onChange}
                    />
                  )}
                />
              ))}
          </QuestionWizard>

          <Box textAlign="right" mt={8}>
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              disabled={isPublishing || isSaving}
              onClick={handleSubmit(handlePublish)}
            >
              {isPublishing ? 'Saving...' : 'Make Visible to Admin'}
            </Button>
          </Box>
        </Box>
      </form>
    </Context.Provider>
  )
}
