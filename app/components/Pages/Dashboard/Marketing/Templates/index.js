import React, { Component } from 'react'
import { indexBy } from 'underscore'

import { getTemplates } from 'models/instant-marketing/get-templates'

import { Header } from './Header'

export default class Templates extends Component {
  state = {
    list: {},
    isLoading: false
  }

  componentDidMount() {
    // this.fetch()
  }

  fetch = async () => {
    try {
      let { medium, types } = this.props

      types = typeof types === 'string' ? types.split(',') : undefined

      this.setState({ isLoading: true })

      const templates = await getTemplates(types, medium)

      this.setState(state => ({
        isLoading: false,
        list: {
          ...state.list,
          [medium]: indexBy(templates, 'template_type')
        }
      }))
    } catch (error) {
      console.log(error)
      this.setState({ isLoading: false })
    }
  }

  render() {
    const { medium } = this.props

    return (
      <React.Fragment>
        <Header
          medium={medium}
          isSideMenuOpen={this.props.isSideMenuOpen}
          toggleSideMenu={this.props.toggleSideMenu}
        />
      </React.Fragment>
    )
  }
}
