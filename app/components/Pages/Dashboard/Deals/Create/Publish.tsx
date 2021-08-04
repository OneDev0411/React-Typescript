import { useState, useEffect } from 'react'

import { Box, Button, CircularProgress, Typography } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { useTitle } from 'react-use'

import {
  createRoles,
  publishDeal,
  updateListing,
  upsertContexts
} from 'actions/deals'
import { addNotification as notify } from 'components/notification'
import { QuestionWizard } from 'components/QuestionWizard'
import { createAddressContext } from 'deals/utils/create-address-context'
import { useLoadFullDeal } from 'hooks/use-load-deal'
import { getStatusContextKey } from 'models/Deal/helpers/brand-context/get-status-field'
import { getField, getStatus } from 'models/Deal/helpers/context'
import { IAppState } from 'reducers'
import {
  getBrandChecklistRequiredContexts,
  getBrandChecklistsById
} from 'reducers/deals/brand-checklists'
import { getDealChecklists } from 'reducers/deals/checklists'
import { selectDealById } from 'reducers/deals/list'
import { selectDealRoles } from 'reducers/deals/roles'
import { selectUser } from 'selectors/user'
import { goTo } from 'utils/go-to'

import { Header } from './components/Header'
import { Context } from './context'
import { DealAddress, PropertyAddress } from './form/DealAddress'
import { DealClient } from './form/DealClient'
import { DealContext } from './form/DealContext'
import { DealStatus } from './form/DealStatus'
import { getChangedRoles } from './helpers/get-changed-roles'
import { getFormContexts } from './helpers/get-form-contexts'
import { BUYER_ROLES, SELLER_ROLES } from './helpers/roles'
import { showStatusQuestion } from './helpers/show-status-question'
import { useStatusList } from './hooks/use-brand-status-list'
import { useStyles } from './hooks/use-styles'

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
  const dispatch = useDispatch()

  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const { isFetchingCompleted } = useLoadFullDeal(params.id)

  const user = useSelector<IAppState, IUser>(state => selectUser(state))
  const deal: IDeal = useSelector<IAppState, IDeal>(({ deals }) =>
    selectDealById(deals.list, params.id)
  )

  const { checklists, brandChecklists } = useSelector(
    ({ deals }: IAppState) => ({
      brandChecklists: deal
        ? getBrandChecklistsById(deals.brandChecklists, deal.brand.id)
        : [],
      checklists: getDealChecklists(deal, deals.checklists)
    })
  )

  const statusList = useStatusList(deal)
  const statusContextKey = getStatusContextKey(deal)

  const isStatusVisible =
    deal && showStatusQuestion(deal, brandChecklists, statusContextKey)

  useEffect(() => {
    if (deal?.is_draft === false) {
      goTo(`/dashboard/deals/${deal.id}`)
    }
  }, [deal])

  const propertyType = deal?.property_type
  const hasAddress = deal?.listing || getField(deal, 'full_address')

  const requiredContexts = useSelector<
    IAppState,
    IBrandChecklist['required_contexts']
  >(({ deals }) => {
    return deal
      ? getBrandChecklistRequiredContexts(
          deals.brandChecklists,
          deal.brand.id,
          deal.property_type?.id,
          deal.has_active_offer ? 'Offer' : deal.deal_type
        ).filter(
          context =>
            ['listing_status', 'contract_status'].includes(context.key) ===
            false
        )
      : []
  })

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

    if (isStatusVisible && statusList.length > 0 && !status) {
      errors.status = 'Status is required'
    }

    requiredContexts
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

      if (values.address) {
        await savePropertyAddress(deal, values.address)
      }

      if (roles.length > 0) {
        await dispatch(createRoles(deal.id, roles))
      }

      const contexts = getFormContexts(
        values,
        deal,
        brandChecklists,
        checklists,
        deal.deal_type
      ).filter(context => !!context.checklist)

      if (contexts.length > 0) {
        await dispatch(upsertContexts(deal.id, contexts))
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
      const contexts = createAddressContext(
        deal,
        brandChecklists,
        checklists,
        property.address
      )

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
                          {propertyType?.is_lease ? 'Tenant' : 'Buyer'}
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
                          {propertyType?.is_lease ? 'Landlord' : 'Seller'}
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

            {isStatusVisible && !getStatus(deal) && statusList.length > 0 && (
              <Controller
                key="status"
                name={`context:${statusContextKey}`}
                control={control}
                defaultValue={getStatus(deal)}
                render={({ onChange }) => (
                  <DealStatus
                    list={statusList}
                    error={errors.status}
                    onChange={onChange}
                  />
                )}
              />
            )}

            {requiredContexts.length > 0 &&
              requiredContexts.map((context: IDealBrandContext) => (
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
