import React from 'react'

import ToolTip from 'components/tooltip'

import { Container, NavBar, NavItem, TabContent } from './styled'

import FoldersPane from './Panes/Folders'
import EventsPane from './Panes/Events'
import MarketingPane from './Panes/Marketing'

import Notifications from '../Notifications'

export default class Tabs extends React.Component {
  tabs = [
    {
      id: 'checklists',
      label: 'Checklists',
      isDisabled: () => false,
      render: props => <FoldersPane {...props} />
    },
    {
      id: 'events',
      label: 'Events',
      isDisabled: () => false,
      render: props => <EventsPane {...props} />
    },
    {
      id: 'marketing',
      label: 'Marketing',
      isDisabled: deal => !deal.listing,
      tooltipWhenDisabled:
        'To enable marketing tab, connect this deal to a MLS listing',
      render: props => <MarketingPane {...props} />
    }
  ]

  getTabTooltip = (tab, isTabDisabled) => {
    if (isTabDisabled && tab.tooltipWhenDisabled) {
      return tab.tooltipWhenDisabled
    }

    return tab.tooltip || null
  }

  render() {
    const activeTab = this.tabs.find(tab => tab.id === this.props.activeTab)

    return (
      <Container>
        <NavBar>
          {this.tabs.map(tab => {
            const isTabDisabled = tab.isDisabled(this.props.deal)

            return (
              <ToolTip
                key={tab.id}
                caption={this.getTabTooltip(tab, isTabDisabled)}
                placement="bottom"
              >
                <NavItem
                  isActive={tab.id === activeTab.id}
                  isDisabled={isTabDisabled}
                  to={
                    !isTabDisabled &&
                    `/dashboard/deals/${this.props.deal.id}/${tab.id}`
                  }
                  onClick={() => !isTabDisabled && this.props.onChangeTab(tab)}
                >
                  {tab.label}
                </NavItem>
              </ToolTip>
            )
          })}
        </NavBar>

        <Notifications deal={this.props.deal} />

        <TabContent>{activeTab.render(this.props)}</TabContent>
      </Container>
    )
  }
}
