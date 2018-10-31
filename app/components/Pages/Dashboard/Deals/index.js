import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import Spinner from 'components/Spinner'

import { getDeals, getDeal, getContexts, getForms } from 'actions/deals'
import { selectDealById } from 'reducers/deals/list'
import { hasUserAccess } from 'utils/user-teams'

const Container = styled.div`
  min-height: 100vh;
`

const Loading = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
`

class DealsContainer extends React.Component {
  state = {
    isFetchingDeal: false
  }

  componentWillMount() {
    if (
      hasUserAccess(this.props.user, 'Deals') === false &&
      hasUserAccess(this.props.user, 'BackOffice') === false
    ) {
      browserHistory.push('/dashboard/mls')
    }

    if (!this.props.contexts) {
      this.props.getContexts()
    }

    if (!this.props.forms) {
      this.props.getForms()
    }

    const { id: dealId } = this.props.params

    if (dealId) {
      this.initializeDeal(dealId)
    }
  }

  initializeDeal = async dealId => {
    const deal = selectDealById(this.props.deals, dealId)

    if (deal && deal.checklists) {
      return
    }

    try {
      if (!deal || !deal.checklist) {
        this.setState({ isFetchingDeal: true })

        // fetch deal by id
        await this.props.getDeal(dealId)

        this.setState({ isFetchingDeal: false })
      }
    } catch (e) {
      browserHistory.push('/dashboard/deals')
      console.error('Could not fetch deal')
    }
  }

  render() {
    if (this.state.isFetchingDeal) {
      return (
        <Loading>
          <Spinner />
        </Loading>
      )
    }

    return <Container>{this.props.children}</Container>
  }
}

export default connect(
  ({ deals, user }) => ({
    error: deals.properties.error,
    deals: deals.list,
    contexts: deals.contexts,
    forms: deals.forms,
    isFetchingDeals: deals.properties.isFetchingDeals,
    user
  }),
  { getDeals, getDeal, getContexts, getForms }
)(DealsContainer)
