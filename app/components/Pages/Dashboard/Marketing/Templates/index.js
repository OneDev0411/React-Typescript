import React, { Component } from 'react'
import _ from 'underscore'
import { browserHistory } from 'react-router'

import { onlyUnique, sortAlphabetically } from 'utils/helpers'
import { getTemplates } from 'models/instant-marketing/get-templates'

import { Header } from './Header'
import { List } from './List'

function getMediums(templates) {
  return templates
    .map(t => t.medium)
    .filter(onlyUnique)
    .sort(sortAlphabetically)
    .reverse()
}

export default class Templates extends Component {
  state = {
    tabs: [],
    templates: [],
    isLoading: false
  }

  componentDidMount() {
    this.fetch()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.types !== this.props.types) {
      this.fetch()
    }
  }

  fetch = _.debounce(async () => {
    const { types } = this.props

    try {
      this.setState({ isLoading: true })

      const templates = await getTemplates(types.split(','), [
        'Email',
        'Social',
        'FacebookCover'
        // 'InstagramStory'
      ])

      const tabs = getMediums(templates)

      this.setState(
        {
          isLoading: false,
          templates,
          tabs
        },
        () =>
          browserHistory.push(
            `/dashboard/marketing/${types}/${this.props.medium || tabs[0]}`
          )
      )
    } catch (error) {
      console.log(error)
      this.setState({ isLoading: false })
    }
  }, 500)

  render() {
    const { state, props } = this

    return (
      <React.Fragment>
        <Header
          types={props.types}
          isSideMenuOpen={props.isSideMenuOpen}
          toggleSideMenu={props.toggleSideMenu}
        />
        <List
          isLoading={state.isLoading}
          isSideMenuOpen={props.isSideMenuOpen}
          medium={props.medium || state.tabs[0]}
          tabs={state.tabs}
          templates={state.templates}
          types={props.types}
        />
      </React.Fragment>
    )
  }
}
