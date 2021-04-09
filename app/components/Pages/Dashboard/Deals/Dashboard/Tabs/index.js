import React from 'react'

import { Tooltip } from '@material-ui/core'

import { Container, NavBar, NavItem, TabContent } from './styled'

import FoldersPane from './Panes/Folders'
import MarketingPane from './Panes/Marketing'
import MediaManagerPane from './Panes/MediaManager'

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
      id: 'photos',
      label: 'Photos',
      isDisabled: () => false,
      render: props => <MediaManagerPane {...props} />
    },
    {
      id: 'marketing',
      label: 'Marketing',
      isDisabled: () => false,
      render: props => <MarketingPane {...props} />
    }
  ]

  getTabTooltip = (tab, isTabDisabled) => {
    if (isTabDisabled && tab.tooltipWhenDisabled) {
      return tab.tooltipWhenDisabled
    }

    return tab.tooltip || ''
  }

  render() {
    const activeTab = this.tabs.find(tab => tab.id === this.props.activeTab)

    return (
      <Container>
        <NavBar>
          {this.tabs.map(tab => {
            const isTabDisabled = tab.isDisabled(this.props.deal)

            return (
              <Tooltip
                key={tab.id}
                title={this.getTabTooltip(tab, isTabDisabled)}
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
              </Tooltip>
            )
          })}
        </NavBar>

        <Notifications deal={this.props.deal} />

        <TabContent>{activeTab.render(this.props)}</TabContent>
      </Container>
    )
  }
}
