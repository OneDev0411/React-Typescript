import React, { Component } from 'react'

import { onlyUnique, sortAlphabetically } from 'utils/helpers'
import { getTemplates } from 'models/instant-marketing/get-templates'

import { Header } from './Header'
import { List } from './List'

function getMediums(templates) {
  return templates
    .map(t => t.medium)
    .filter(onlyUnique)
    .sort(sortAlphabetically)
}

export default class Templates extends Component {
  state = {
    templates: [],
    tabs: ['Email'],
    isLoading: false
  }

  componentDidMount() {
    this.fetch()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.type !== this.props.type) {
      this.fetch()
    }
  }

  fetch = async () => {
    try {
      this.setState({ isLoading: true })

      const templates = await getTemplates(this.props.type, ['Email', 'Social'])

      this.setState({
        isLoading: false,
        templates,
        tabs: getMediums(templates)
      })
    } catch (error) {
      console.log(error)
      this.setState({ isLoading: false })
    }
  }

  render() {
    const { state, props } = this

    return (
      <React.Fragment>
        <Header
          type={props.type}
          isSideMenuOpen={props.isSideMenuOpen}
          toggleSideMenu={props.toggleSideMenu}
        />
        <List
          isLoading={state.isLoading}
          isSideMenuOpen={props.isSideMenuOpen}
          medium={props.medium}
          tabs={state.tabs}
          templates={state.templates}
          type={props.type}
        />
      </React.Fragment>
    )
  }
}
