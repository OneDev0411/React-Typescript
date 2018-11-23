import React from 'react'
import { browserHistory, withRouter } from 'react-router'
import Flex from 'styled-flex-component'
import { groupBy } from 'lodash'

import { templateTypes } from '../data'

import { Template } from './Template'
import { Loader, Tab } from './styled'

class List extends React.Component {
  handleSelectedType = event => {
    browserHistory.push(
      `/dashboard/marketing/${this.props.params.medium}/${
        event.target.dataset.type
      }`
    )
  }

  renderTemplate = template => (
    <Template key={template.id} template={template} />
  )

  renderTemplates = templates => (
    <Flex wrap>{templates.map(this.renderTemplate)}</Flex>
  )

  renderAll = () => {
    const { templates } = this.props

    const allTemplates = groupBy(templates, 'template_type')

    return Object.keys(allTemplates).map(type => (
      <div key={type} style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          {templateTypes[type] || type}
        </div>
        {this.renderTemplates(allTemplates[type])}
      </div>
    ))
  }

  renderByType = selectedType =>
    this.renderTemplates(
      this.props.templates.filter(t => t.template_type === selectedType)
    )

  renderPanel = selectedType => {
    if (selectedType === 'All') {
      return this.renderAll()
    }

    return this.renderByType(selectedType)
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
        <Flex style={{ marginBottom: '2rem' }}>
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
        {this.renderPanel(selectedType)}
      </div>
    )
  }
}

export default withRouter(List)
