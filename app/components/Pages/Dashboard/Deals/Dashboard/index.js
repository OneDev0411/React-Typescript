import React from 'react'
import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'
import _ from 'underscore'

import { deleteNotifications } from 'models/Deal/notification'

import { getDeal } from 'actions/deals'
import { selectDealById } from 'reducers/deals/list'

import FactsheetSection from './Factsheet'

import { PageHeader } from './Header'

import {
  Container,
  ColumnsContainer,
  SideColumnContainer,
  Card
} from './styled'

class DealDetails extends React.Component {
  componentDidMount() {
    this.handleNotifications(this.props.deal)
  }

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

        <ColumnsContainer>
          <SideColumnContainer>
            <Card>
              <FactsheetSection
                deal={deal}
                section="CriticalDates"
                title="Critical Dates"
              />

              <FactsheetSection
                deal={deal}
                section="CDA"
                title="CDA Information"
              />

              <FactsheetSection
                deal={deal}
                section="Listing"
                title="Listing Information"
              />
            </Card>
          </SideColumnContainer>
        </ColumnsContainer>
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
