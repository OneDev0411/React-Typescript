import React from 'react'

import ToolTip from 'components/tooltip'

import { Container, NavBar, NavItem, TabContent } from './styled'

import ChecklistsPane from './Panes/Checklist'
import FileManagerPane from './Panes/FileManager'
import EventsPane from './Panes/Events'
import MarketingPane from './Panes/Marketing'

export default class Tabs extends React.Component {
  tabs = [
    {
      id: 'checklists',
      label: 'Checklists',
      isDisabled: () => false,
      render: props => <ChecklistsPane {...props} />
    },
    {
      id: 'files',
      label: 'Files',
      isDisabled: () => false,
      render: props => <FileManagerPane {...props} />
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
                  onClick={() => !isTabDisabled && this.props.onChangeTab(tab)}
                >
                  {tab.label}
                </NavItem>
              </ToolTip>
            )
          })}
        </NavBar>

        <TabContent>{activeTab.render(this.props)}</TabContent>
      </Container>
    )
  }
}
