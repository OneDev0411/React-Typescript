import React, { Component } from 'react'

import { onlyUnique } from 'utils/helpers'
import { getTemplates } from 'models/instant-marketing/get-templates'

import { templateTypes } from './data'
import { Header } from './Header'
import Main from './Main'

export default class Templates extends Component {
  state = {
    templates: [],
    tabs: [],
    isLoading: false
  }

  componentDidMount() {
    this.fetch()
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
        <Main
          tabs={state.tabs}
          templates={state.templates}
          isLoading={state.isLoading}
        />
      </React.Fragment>
    )
  }
}
