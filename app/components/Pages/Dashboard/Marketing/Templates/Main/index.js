import React from 'react'
import { browserHistory, withRouter } from 'react-router'
import Flex from 'styled-flex-component'

import { Loader, Tab } from './styled'

class Main extends React.Component {
  handleSelectedType = event => {
    browserHistory.push(
      `/dashboard/marketing/${this.props.params.medium}/${
        event.target.dataset.type
      }`
    )
  }

  render() {
    const { props } = this
    const selectedType = props.params.types || 'All'

    if (props.isLoading) {
      return <Loader />
    }

    if (props.templates.length === 0) {
      return null
    }

    return (
      <div style={{ padding: '0 1.5rem' }}>
        <Flex>
          {this.props.tabs.map((tab, index) => (
            <Tab
              key={index}
              inverse
              appearance="link"
              data-type={tab.type}
              onClick={this.handleSelectedType}
              selected={selectedType === tab.type}
            >
              {tab.title}
            </Tab>
          ))}
        </Flex>
      </div>
    )
  }
}

export default withRouter(Main)
