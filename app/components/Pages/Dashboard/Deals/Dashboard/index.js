import React from 'react'
import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'
import _ from 'underscore'

import { deleteNotifications } from 'models/Deal/notification'

import { getDeal } from 'actions/deals'
import { selectDealById } from 'reducers/deals/list'

import { PageHeader } from './Header'
import Checklists from './Checklists'
import Tabs from './Tabs'

import {
  Container,
  PageContent,
  SideColumnContainer,
  MainContainer
} from './styled'

import SideNav from './SideNav'

class DealDetails extends React.Component {
  state = {
    activeTab: 'checklists'
  }

  componentDidMount() {
    this.handleNotifications(this.props.deal)
  }

  handleChangeActiveTab = tab =>
    this.setState({
      activeTab: tab.id
    })

  handleNotifications(deal) {
    if (!deal || !Array.isArray(deal.new_notifications)) {
      return false
    }

    const notifications = deal.new_notifications.filter(
      notification => !notification.room
    )

    if (notifications.length > 0) {
      deleteNotifications(_.pluck(notifications, 'id'))
    }
  }

  render() {
    const { deal } = this.props

    return (
      <Container>
        <PageHeader deal={deal} />

        <Tabs
          activeTab={this.state.activeTab}
          onChangeTab={this.handleChangeActiveTab}
        />

        {/* <PageContent>
          <SideColumnContainer>
            <SideNav deal={deal} />
          </SideColumnContainer>

          <MainContainer>
            <Checklists deal={deal} />
          </MainContainer>
        </PageContent> */}
      </Container>
    )
  }
}

function mapStateToProps({ deals }, props) {
  return {
    selectedTask: deals.properties.selectedTask,
    deal: selectDealById(deals.list, props.params.id)
  }
}

export default connect(
  mapStateToProps,
  { getDeal }
)(DealDetails)
