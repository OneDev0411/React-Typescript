import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

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

  handleStartEditContext = field => {
    this.setState({
      activeContext: field.name
    })
  }

  handleCancleEditContext = () =>
    this.setState({
      activeContext: null
    })

  handleChangeContext = (field, value) => {
    const currentValueObject = DealContext.getValue(this.props.deal, field)

    const isValueChanged = value !== this.getFieldValue(currentValueObject)
    const isValueValid =
      _.isUndefined(value) === false && field.validate(field, value)

    if (isValueChanged === false || isValueValid === false) {
      this.setState({
        activeContext: false
      })

      return false
    }

    this.updateContext(field, value)
  }

  handleRemoveContext = field => {
    this.updateContext(field, null)
  }

  updateContext = async (field, value) => {
    this.setState({
      activeContext: field.name,
      isSavingContext: true
    })

    try {
      await this.props.updateContext(this.props.deal.id, {
        [field.name]: {
          value,
          approved: isBackOffice ? true : !field.needs_approval
        }
      })
    } catch (e) {
      console.log(e)
    }

    this.setState({
      activeContext: false,
      isSavingContext: false
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
            const isDateContext = field.data_type === 'Date'
            const isActiveContext = activeContext === field.name

            // if is saving active context, then show a loader
            if (isActiveContext && this.state.isSavingContext) {
              return (
                <Item key={field.name} showBorder isSaving>
                  Saving Field ...
                </Item>
              )
            }

            // if is editing active context, then show editing mode
            if (isActiveContext) {
              return (
                <Item key={field.name} showBorder isDateContext>
                  {isDateContext && <ItemLabel>{field.label}</ItemLabel>}

                  <Editable
                    field={field}
                    isDateContext={isDateContext}
                    defaultValue={value}
                    onCancel={this.handleCancleEditContext}
                    onSave={this.handleChangeContext}
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
