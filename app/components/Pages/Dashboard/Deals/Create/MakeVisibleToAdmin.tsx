import { useEffect, useState, useCallback } from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from '@material-ui/core'
import { mdiClose } from '@mdi/js'
import { useForm, Controller } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { useTitle } from 'react-use'

import { useBrandPropertyTypeRoles } from '@app/hooks/use-brand-property-type-roles'
import { selectDealById } from '@app/reducers/deals/list'
import { Callout } from '@app/views/components/Callout'
import {
  createRoles,
  publishDeal,
  updateListing,
  upsertContexts
} from 'actions/deals'
import { addNotification as notify } from 'components/notification'
import { QuestionWizard } from 'components/QuestionWizard'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { createAddressContext } from 'deals/utils/create-address-context'
import { getStatusContextKey } from 'models/Deal/helpers/brand-context/get-status-field'
import { getField, getStatus } from 'models/Deal/helpers/context'
import { IAppState } from 'reducers'
import {
  getBrandChecklistRequiredContexts,
  getBrandChecklistsById
} from 'reducers/deals/brand-checklists'
import { getDealChecklists } from 'reducers/deals/checklists'
import { selectUser } from 'selectors/user'

import { Context } from './context'
import { DealAddress, PropertyAddress } from './form/DealAddress'
import { DealContext } from './form/DealContext'
import { DealRequiredRole } from './form/DealRequiredRole'
import { DealStatus } from './form/DealStatus'
import { getChangedRoles } from './helpers/get-changed-roles'
import { getFormContexts } from './helpers/get-form-contexts'
import { showStatusQuestion } from './helpers/show-status-question'
import { useStatusList } from './hooks/use-brand-status-list'
import { useDealRoles } from './hooks/use-deal-roles'
import { useStyles } from './hooks/use-styles'

type FormValues = {
  roles: IDealRole[]
  address: PropertyAddress
} & Record<string, unknown>

interface Props {
  dealId: UUID
  onCancel: () => void
  onComplete: () => void
}

export default function MakeVisibleToAdmin({
  dealId,
  onCancel,
  onComplete
}: Props) {
  useTitle('Publish Draft Deal | Deals | Rechat')

  const { control, watch, handleSubmit, formState } = useForm()
  const classes = useStyles()
  const dispatch = useDispatch()

  const [isPublishing, setIsPublishing] = useState(false)
  const [isAutoPublishing, setIsAutoPublishing] = useState(false)
  const [isAutoPublishingDisabled, setIsAutoPublishingDisabled] =
    useState(false)

  const user = useSelector<IAppState, IUser>(state => selectUser(state))
  const deal = useSelector<IAppState, IDeal>(({ deals }) =>
    selectDealById(deals.list, dealId)
  )
  const dealRoles = useDealRoles(deal)

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

  const hasAddress = deal?.listing || getField(deal, 'full_address')

  /* extract required roles from property type's roles */
  const requiredRoles = useBrandPropertyTypeRoles(
    deal.property_type.label
  ).requiredRoles.filter(
    requiredRole =>
      requiredRole.checklist_types.includes(deal.deal_type) &&
      dealRoles.some(dealRole => dealRole.role === requiredRole.role) === false
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
          deal.has_active_offer ? 'Offer' : deal.deal_type
        ).filter(
          context =>
            ['listing_status', 'contract_status'].includes(context.key) ===
            false
        )
      : []
  })

  const validate = useCallback(() => {
    const errors: Record<keyof FormValues, any> = {}

    if (!deal) {
      return errors
    }

    const address =
      watch('address') || deal?.listing || getField(deal, 'full_address')
    const status =
      watch(`context:${statusContextKey}`) || getField(deal, statusContextKey)

    if (!address) {
      errors.address = 'Address is required'
    }

    requiredRoles.forEach(requiredRole => {
      const isCreated = (watch('roles') || []).some(
        role => role.role === requiredRole.role
      )

      if (!isCreated) {
        errors.roles = {
          ...(errors.roles || {}),
          [requiredRole.role]: `${requiredRole.title} is required`
        }
      }
    })

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
  }, [
    deal,
    isStatusVisible,
    requiredContexts,
    statusContextKey,
    statusList.length,
    requiredRoles,
    watch
  ])

  const saveForm = async (values = control.getValues() as FormValues) => {
    setIsAutoPublishingDisabled(true)

    const { roles } = values

    try {
      setIsPublishing(true)

      if (values.address) {
        await savePropertyAddress(deal, values.address)
      }

      if (roles?.length > 0) {
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

      dispatch(publishDeal(deal.id))
    } catch (e) {
      console.log(e)
    } finally {
      setIsPublishing(false)
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

      await saveForm(values)
    } catch (e) {
      console.log(e)
    } finally {
      setIsPublishing(false)
    }
  }

  const errors = formState.isSubmitted ? validate() : {}

  useEffect(() => {
    if (isAutoPublishingDisabled || isAutoPublishing || formState.isDirty) {
      return
    }

    const isFormValid = Object.keys(validate()).length === 0

    if (isFormValid && deal.is_draft) {
      setIsAutoPublishing(true)
      dispatch(publishDeal(deal.id))
    }
  }, [
    validate,
    dispatch,
    deal.id,
    deal.is_draft,
    formState.isDirty,
    isAutoPublishing,
    isAutoPublishingDisabled
  ])

  useEffect(() => {
    if (deal.is_draft === false) {
      setIsPublishing(false)
      setIsAutoPublishing(false)
      onComplete()
    }
  }, [deal.is_draft, onComplete])

  if (isAutoPublishing) {
    return null
  }

  return (
    <Dialog open fullWidth maxWidth="md" onClose={onCancel}>
      <Context.Provider
        value={{
          deal,
          user
        }}
      >
        <form>
          <DialogTitle>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <div>Notify Office to Review</div>

              <IconButton color="secondary" size="medium" onClick={onCancel}>
                <SvgIcon path={mdiClose} size={muiIconSizes.xlarge} />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent>
            <Callout type="info" style={{ margin: 0 }}>
              <Typography variant="subtitle1">
                Your office admin requires you to provide some more informations
                before you can notify them.
              </Typography>
            </Callout>

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

                <Controller
                  name="roles"
                  control={control}
                  render={({ value = [], onChange }) => (
                    <>
                      {requiredRoles.map(role => (
                        <DealRequiredRole
                          key={role.role}
                          concurrentMode
                          role={role}
                          error={errors.roles?.[role.role]}
                          rolesList={value}
                          dealSide={deal.deal_type}
                          onChange={(role, type) =>
                            onChange(getChangedRoles(value, role, type))
                          }
                        />
                      ))}
                    </>
                  )}
                />

                {isStatusVisible &&
                  !getStatus(deal) &&
                  statusList.length > 0 && (
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
            </Box>
          </DialogContent>

          <DialogActions>
            <Box textAlign="right" my={2} mr={4}>
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isPublishing}
                onClick={handleSubmit(handlePublish)}
              >
                {isPublishing ? 'Working...' : 'Notify Office to Review'}
              </Button>
            </Box>
          </DialogActions>
        </form>
      </Context.Provider>
    </Dialog>
  )
}
