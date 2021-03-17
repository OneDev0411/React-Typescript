import React, { useState, useMemo, useEffect } from 'react'
import {
  Box,
  makeStyles,
  CircularProgress,
  Typography
} from '@material-ui/core'
import { useTitle } from 'react-use'
import { useSelector, useDispatch } from 'react-redux'

import { QuestionWizard } from 'components/QuestionWizard'
import { addNotification as notify } from 'components/notification'

import { publishDeal } from 'actions/deals'

import { IAppState } from 'reducers'
import { selectUser } from 'selectors/user'

import { selectDealById } from 'reducers/deals/list'
import { selectDealRoles } from 'reducers/deals/roles'
import { useLoadFullDeal } from 'hooks/use-load-deal'

import { goTo } from 'utils/go-to'

import { getDealContexts } from './helpers/get-deal-contexts'

import { DealContext } from './form/DealContext'
import { DealClient } from './form/DealClient'
import { DealStatus } from './form/DealStatus'

import { Header } from './components/Header'

import { useStatusList } from './hooks/use-brand-status-list'
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
    name: 'PublishDraftDeal'
  }
)

interface Props {
  params: {
    id: UUID
  }
}

export default function Publish({ params }: Props) {
  const classes = useStyles()

  useTitle('Publish Draft Deal | Deals | Rechat')

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

  const contexts = useMemo(() => {
    return deal ? getDealContexts(user, deal.deal_type, deal.property_type) : []
  }, [deal, user])

  const roles = useSelector<IAppState, IDealRole[]>(({ deals }) =>
    selectDealRoles(deals.roles, deal)
  )

  const handlePublish = async () => {
    try {
      setIsPublishing(true)
      await dispatch(publishDeal(deal.id))

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
        user,
        deal
      }}
    >
      <Header
        confirmationMessage="Cancel deal publish?"
        onClose={() => goTo(`/dashboard/deals/${deal.id}`)}
      />

      <Box className={classes.root}>
        <QuestionWizard onFinish={handlePublish}>
          {deal.deal_type === 'Buying' && (
            <DealClient
              side="Buying"
              title={`What's the ${
                propertyType?.includes('Lease') ? 'tenant' : 'buyer'
              }'s legal name?`}
              submitButtonLabel="Looks Good"
              roles={roles}
            />
          )}

          <DealClient
            side="Selling"
            title={`What's the ${
              propertyType?.includes('Lease') ? 'landlord' : 'seller'
            }'s legal name?`}
            submitButtonLabel="Looks Good"
            roles={roles}
          />

          {deal &&
            showStatusQuestion(
              deal,
              deal.deal_type,
              deal.deal_type === 'Selling'
                ? 'listing_status'
                : 'contract_status'
            ) &&
            statusList.length > 1 && <DealStatus list={statusList} />}

          {contexts.length > 0 &&
            contexts.map((context: IDealBrandContext) => (
              <DealContext key={context.id} context={context} />
            ))}
        </QuestionWizard>
      </Box>
    </Context.Provider>
  )
}
