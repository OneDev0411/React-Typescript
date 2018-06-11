import React from 'react'
import {
  Container,
  Menu,
  Trigger,
  Content
} from '../../../../views/components/SlideMenu'
import PageHeader from '../../../../views/components/PageHeader'
import ActionButton from '../../../../views/components/Button/ActionButton'
import DatePicker from '../../../../views/components/DatePicker'

class CalendarContainer extends React.Component {
  state = {
    isMenuOpen: true
  }

  toggleSideMenu = () => this.setState({ isMenuOpen: !this.state.isMenuOpen })

  render() {
    const { isMenuOpen } = this.state

    return (
      <Container>
        <Menu isOpen={isMenuOpen} width={250}>
          <DatePicker />
        </Menu>

        <Content>
          <PageHeader>
            <PageHeader.Title backButton={false}>
              <Trigger onClick={this.toggleSideMenu} />
              <PageHeader.Heading>Calendar</PageHeader.Heading>
            </PageHeader.Title>

            <PageHeader.Menu>
              <ActionButton>Add Task</ActionButton>
            </PageHeader.Menu>
          </PageHeader>
          ----
        </Content>
      </Container>
    )
  }
}

export default CalendarContainer
