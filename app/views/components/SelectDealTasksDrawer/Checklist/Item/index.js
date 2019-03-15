import React from 'react'

import { NotifyOffice } from '../../NotifyOffice'

import { Container, Title, NotifyOfficeContainer } from './styled'

export class Item extends React.Component {
  state = {
    notifyOffice: true
  }

  handleToggleNotifyOffice = () =>
    this.setState(state => ({
      notifyOffice: !state.notifyOffice
    }))

  render() {
    const { props } = this

    return (
      <Container key={props.id}>
        <Title
          onClick={() =>
            props.onSelectItem({
              type: props.type,
              id: props.id,
              checklistId: props.checklist.id,
              notifyOffice: this.state.notifyOffice
            })
          }
        >
          {props.title}
        </Title>

        <NotifyOfficeContainer>
          <NotifyOffice
            type={props.type}
            id={props.id}
            isSelected={this.state.notifyOffice}
            checklist={props.checklist}
            onChange={this.handleToggleNotifyOffice}
          />
        </NotifyOfficeContainer>
      </Container>
    )
  }
}
