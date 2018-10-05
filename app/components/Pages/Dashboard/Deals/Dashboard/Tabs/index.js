import React from 'react'
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
      render: props => <ChecklistsPane {...props} />
    },
    {
      id: 'files',
      label: 'Files',
      render: props => <FileManagerPane {...props} />
    },
    {
      id: 'events',
      label: 'Events',
      render: props => <EventsPane {...props} />
    },
    {
      id: 'marketing',
      label: 'Marketing',
      render: props => <MarketingPane {...props} />
    }
  ]

  render() {
    const activeTab = this.tabs.find(tab => tab.id === this.props.activeTab)

    return (
      <Container>
        <NavBar>
          {this.tabs.map(tab => (
            <NavItem
              key={tab.id}
              isActive={tab.id === activeTab.id}
              onClick={() => this.props.onChangeTab(tab)}
            >
              {tab.label}
            </NavItem>
          ))}
        </NavBar>

        <TabContent>{activeTab.render(this.props)}</TabContent>
      </Container>
    )
  }
}
