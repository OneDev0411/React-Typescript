import React from 'react'

import MakeVisibleToAdmin from '@app/components/Pages/Dashboard/Deals/Create/MakeVisibleToAdmin'

import { NotifyOffice } from '../../NotifyOffice'

import { Container, Title, NotifyOfficeContainer } from './styled'

export class Item extends React.Component {
  state = {
    notifyOffice: true,
    isMakeVisibleDialogOpen: false
  }

  handleToggleNotifyOffice = () =>
    this.setState(state => ({
      notifyOffice: !state.notifyOffice
    }))

  handleSelectItem = () => {
    if (this.state.notifyOffice && this.props.deal.is_draft) {
      this.setState({
        isMakeVisibleDialogOpen: true
      })

      return
    }

    this.setState({
      isMakeVisibleDialogOpen: false
    })

    this.props.onSelectItem({
      type: this.props.type,
      id: this.props.id,
      checklistId: this.props.checklist.id,
      notifyOffice: this.state.notifyOffice
    })
  }

  render() {
    const { props } = this

    return (
      <Container key={props.id}>
        <Title onClick={this.handleSelectItem}>{props.title}</Title>

        <NotifyOfficeContainer>
          <NotifyOffice
            type={props.type}
            id={props.id}
            isSelected={this.state.notifyOffice}
            checklist={props.checklist}
            onChange={this.handleToggleNotifyOffice}
          />
        </NotifyOfficeContainer>

        {this.state.isMakeVisibleDialogOpen && (
          <MakeVisibleToAdmin
            dealId={this.props.deal.id}
            onCancel={() =>
              this.setState({
                isMakeVisibleDialogOpen: false
              })
            }
            onComplete={this.handleSelectItem}
          />
        )}
      </Container>
    )
  }
}
