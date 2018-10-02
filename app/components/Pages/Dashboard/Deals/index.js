import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { getDeals, getDeal, getContexts, getForms } from 'actions/deals'
import { selectDealById } from 'reducers/deals/list'

const Container = styled.div`
  min-height: 100vh;
`

class DealsContainer extends React.Component {
  state = {
    isFetchingDeal: false
  }

  componentWillMount() {
    const { id: dealId } = this.props.params

    // if (!this.props.deals && !this.props.isFetchingDeals) {
    //   this.props.getDeals(this.props.user)
    // }

    if (!this.props.contexts) {
      this.props.getContexts()
    }

    if (!this.props.forms) {
      this.props.getForms()
    }

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
      return <div>Is fetching deal</div>
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
