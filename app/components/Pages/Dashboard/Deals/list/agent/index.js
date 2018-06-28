import React from 'react'

import { Container, Menu } from '../../../../../../views/components/SlideMenu'

import { PageContent, GridContainer } from './styled'

import Header from './header'
import Grid from './grid'
import AgentFilters from './filters'

class AgentTable extends React.Component {
  state = {
    isSideMenuOpen: true
  }

  toggleSideMenu = () =>
    this.setState(state => ({
      isSideMenuOpen: !state.isSideMenuOpen
    }))

  render() {
    const { isSideMenuOpen } = this.state
    const { params } = this.props

    return (
      <Container>
        <Menu
          width={160}
          isSideMenuOpen={isSideMenuOpen}
          isOpen={isSideMenuOpen}
        >
          <AgentFilters activeFilter={params.filter} />
        </Menu>

        <PageContent>
          <Header onMenuTriggerChange={this.toggleSideMenu} />

          <GridContainer>
            <Grid activeFilter={params.filter} />
          </GridContainer>
        </PageContent>
      </Container>
    )
  }
}

export default AgentTable
