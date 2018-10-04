import React from 'react'
import { connect } from 'react-redux'

import Deal from 'models/Deal'
import DealContext from 'models/DealContext'
import ToolTip from 'components/tooltip'

import { updateContext, approveContext } from 'actions/deals'

import { isBackOffice } from 'utils/user-teams'

import {
  Container,
  SectionTitle,
  ItemsContainer,
  Item,
  ItemLabel,
  ItemValue
} from './styled'

import Actions from './Actions'
import Editable from './Editable'

class Factsheet extends React.Component {
  state = {
    activeContext: null,
    isSavingContext: false
  }

  handleRemoveContext = name => {
    console.log(name)
  }

  handleStartEditContext = name => {
    this.setState({
      activeContext: name
    })
  }

  handleCancleEditContext = () =>
    this.setState({
      activeContext: null
    })

  handleSaveContext = () => {
    // todo
    this.setState({
      isSavingContext: true
    })
  }

  getFormattedValue = (field, value) => field.getFormattedValue(value)

  getFieldValue = valueObject => {
    if (
      _.isUndefined(valueObject.rawValue) === false &&
      valueObject.rawValue !== null
    ) {
      return valueObject.rawValue.toString()
    }

    if (
      _.isUndefined(valueObject.value) === false &&
      valueObject.value !== null
    ) {
      return valueObject.value.toString()
    }

    return ''
  }

  isContextApproved = field => {
    const context = Deal.get.context(this.props.deal, field.name)

    return (context && context.approved_at !== null) || field.approved
  }

  render() {
    const { deal, isBackOffice } = this.props
    const { activeContext } = this.state

    const table = DealContext.getFactsheetSection(deal, this.props.section)

    if (table.length === 0) {
      return false
    }

    return (
      <Container>
        <SectionTitle>{this.props.title}</SectionTitle>

        <ItemsContainer>
          {table.map(field => {
            const valueObject = DealContext.getValue(deal, field)
            const value = this.getFieldValue(valueObject)
            const isApproved = this.isContextApproved(field)

            if (activeContext === field.name) {
              return (
                <Item key={field.name} isEditing>
                  <Editable
                    field={field}
                    defaultValue={value}
                    onClickOutside={this.handleCancleEditContext}
                    onClickSave={this.handleSaveContext}
                  />
                </Item>
              )
            }

            return (
              <ToolTip
                key={field.name}
                caption={
                  isApproved || isBackOffice ? null : 'Pending Office Approval'
                }
              >
                <Item>
                  <ItemLabel>{field.label}</ItemLabel>
                  <ItemValue>{field.getFormattedValue(value)}</ItemValue>

                  <Actions
                    field={field}
                    onClickEditContext={this.handleStartEditContext}
                    onClickRemoveContext={this.handleRemoveContext}
                  />
                </Item>
              </ToolTip>
            )
          })}
        </ItemsContainer>
      </Container>
    )
  }
}

export default connect(
  ({ user }) => ({
    isBackOffice: isBackOffice(user)
  }),
  { updateContext, approveContext }
)(Factsheet)
