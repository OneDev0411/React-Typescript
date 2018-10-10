import React from 'react'

import { searchEvents } from '../../../../../models/tasks/search-events'

import { Header } from '../components/PageHeader'
import { Grid } from './Grid'

export default class Tours extends React.Component {
  state = {
    isFetching: false,
    tours: {
      data: [],
      info: {
        total: 0,
        count: 0
      }
    }
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = async () => {
    try {
      this.setState({ isFetching: true })

      const tours = await searchEvents({ task_type: 'Tour' })

      this.setState({ isFetching: false, tours })
    } catch (error) {
      console.log(error)
      this.setState({ isFetching: false })
    }
  }

  render() {
    return (
      <React.Fragment>
        <Header
          title="Tours"
          showMenu={false}
          isSideMenuOpen={this.props.isSideMenuOpen}
          toggleSideMenu={this.props.toggleSideMenu}
        />
        <Grid isFetching={this.state.isFetching} tours={this.state.tours} />
      </React.Fragment>
    )
  }
}
