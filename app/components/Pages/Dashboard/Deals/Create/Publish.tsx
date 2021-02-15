import React, { useMemo } from 'react'
import { Box, makeStyles, CircularProgress } from '@material-ui/core'
import { useTitle } from 'react-use'
import { useSelector } from 'react-redux'

import { QuestionWizard } from 'components/QuestionWizard'

import { getField } from 'models/Deal/helpers/context'

import { IAppState } from 'reducers'
import { selectUser } from 'selectors/user'

import { selectDealById } from 'reducers/deals/list'
import { selectDealRoles } from 'reducers/deals/roles'
import { useLoadFullDeal } from 'hooks/use-load-deal'

import { getDealContexts } from './helpers/get-deal-contexts'

import { DealContext } from './form/DealContext'
import { DealClient } from './form/DealClient'

import { BUYER_ROLES, SELLER_ROLES } from './helpers/roles'

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

  const { isFetchingCompleted } = useLoadFullDeal(params.id)

  const user = useSelector<IAppState, IUser>(state => selectUser(state))
  const deal = useSelector<IAppState, IDeal>(({ deals }) =>
    selectDealById(deals.list, params.id)
  )

  const contexts = deal
    ? getDealContexts(user, deal.deal_type, deal.property_type).filter(
        context => getField(deal, context.key) == null
      )
    : []

  const roles = useSelector<IAppState, IDealRole[]>(({ deals }) =>
    selectDealRoles(deals.roles, deal)
  )

  const buyerClients = useMemo(
    () => roles.filter(({ role }) => BUYER_ROLES.includes(role)),
    []
  )

  const sellerClients = useMemo(
    () => roles.filter(({ role }) => SELLER_ROLES.includes(role)),
    []
  )

  const handleFinish = () => {
    console.log('>>>>>')
  }

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
      <Box className={classes.root}>
        <QuestionWizard onFinish={handleFinish}>
          {buyerClients.length === 0 && deal.deal_type === 'Buying' && (
            <DealClient
              side="Buying"
              title="What's the buyers's legal name?"
              roles={roles}
            />
          )}

          {sellerClients.length === 0 && deal.deal_type === 'Selling' && (
            <DealClient
              side="Selling"
              title="What's the seller's legal name?"
              roles={roles}
            />
          )}

          {contexts.map((context: IDealBrandContext) => (
            <DealContext key={context.id} context={context} />
          ))}

          {/* {
            
          } */}
        </QuestionWizard>
      </Box>
    </Context.Provider>
  )
}
