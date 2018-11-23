import React, { Component } from 'react'

import { onlyUnique } from 'utils/helpers'
import { getTemplates } from 'models/instant-marketing/get-templates'

import { templateTypes } from './data'
import { Header } from './Header'
import List from './List'

export default class Templates extends Component {
  state = {
    templates: [],
    tabs: [],
    isLoading: false
  }

  componentDidMount() {
    this.fetch()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.medium !== this.props.medium) {
      this.fetch()
    }
  }

  fetch = async () => {
    try {
      this.setState({ isLoading: true })

      const templates = await getTemplates(undefined, this.props.medium)

      this.setState({
        isLoading: false,
        templates,
        tabs: this.getTypes(templates)
      })
    } catch (error) {
      console.log(error)
      this.setState({ isLoading: false })
    }
  }

  getTypes = templates => {
    const types = templates.map(t => t.template_type).filter(onlyUnique)

    return [
      { title: 'All', type: 'All' },
      ...types.map(type => {
        const title = templateTypes[type] ? templateTypes[type] : type

        return { title, type }
      })
    ]
  }

  render() {
    const { state, props } = this

    return (
      <React.Fragment>
        <Header
          medium={props.medium}
          isSideMenuOpen={props.isSideMenuOpen}
          toggleSideMenu={props.toggleSideMenu}
        />
        <List
          tabs={state.tabs}
          templates={state.templates}
          isLoading={state.isLoading}
        />
      </React.Fragment>
    )
  }
}
