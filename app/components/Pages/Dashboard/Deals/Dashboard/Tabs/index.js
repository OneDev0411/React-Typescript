import React from 'react'
import { Container, TabItem } from './styled'

export default class Tabs extends React.Component {
  tabs = [
    { id: 'checklists', label: 'Checklists' },
    { id: 'files', label: 'Files' },
    { id: 'events', label: 'Events' },
    { id: 'marketing', label: 'Marketing' }
  ]

  render() {
    return (
      <Container>
        {this.tabs.map(tab => (
          <TabItem
            key={tab.id}
            isActive={tab.id === this.props.activeTab}
            onClick={() => this.props.onChangeTab(tab)}
          >
            {tab.label}
          </TabItem>
        ))}
      </Container>
    )
  }
}
