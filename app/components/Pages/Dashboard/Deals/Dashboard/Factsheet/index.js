import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import Flex from 'styled-flex-component'

import Deal from 'models/Deal'
import DealContext from 'models/Deal/helpers/dynamic-context'
import ToolTip from 'components/tooltip'

import { upsertContexts, approveContext } from 'actions/deals'
import { createUpsertObject } from 'models/Deal/helpers/dynamic-context'

import LinkButton from 'components/Button/LinkButton'

import {
  Container,
  SectionTitle,
  ItemsContainer,
  Item,
  ItemLabel,
  ItemValue,
  FactsheetDivider
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
      activeContext: field.key
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

    this.saveContext(field, value)
  }

  handleRemoveContext = field => {
    this.saveContext(field, null)
  }

  handleApproveField = async field => {
    if (!this.props.isBackOffice) {
      return false
    }

    // set state
    this.setState({
      activeContext: field.key,
      isSavingContext: true
    })

    const context = Deal.get.context(this.props.deal, field.key)

    try {
      await this.props.approveContext(this.props.deal.id, context.id)
    } catch (e) {
      console.log(e)
    }

    // set state
    this.setState({ activeContext: null, isSavingContext: false })
  }

  saveContext = async (field, value) => {
    this.setState({
      activeContext: field.key,
      isSavingContext: true
    })

    try {
      const context = createUpsertObject(
        this.props.deal,
        field.key,
        value,
        this.props.isBackOffice ? true : !field.needs_approval
      )

      await this.props.upsertContexts(this.props.deal.id, [context])
    } catch (e) {
      console.log(e)
    }

    this.setState({
      activeContext: null,
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
    const context = Deal.get.context(this.props.deal, field.key)

    if (!context || context.source === 'MLS') {
      return true
    }

    return (context && context.approved_at !== null) || field.approved
  }

  showApproveButton = field =>
    this.props.isBackOffice && !this.isContextApproved(field)

  render() {
    const { activeContext } = this.state

    if (!this.props.display) {
      return false
    }

    const table = DealContext.getFactsheetSection(
      this.props.deal,
      this.props.section
    )

    if (table.length === 0) {
      return false
    }

    return (
      <Fragment>
        <Container>
          {this.props.title && <SectionTitle>{this.props.title}</SectionTitle>}

          <ItemsContainer>
            {table.map(field => {
              const valueObject = DealContext.getValue(this.props.deal, field)
              const value = this.getFieldValue(valueObject)
              const isApproved = this.isContextApproved(field)
              const isDateContext = field.data_type === 'Date'
              const isActiveContext = activeContext === field.key

              // if is saving active context, then show a loader
              if (isActiveContext && this.state.isSavingContext) {
                return (
                  <Item key={field.key} showBorder isSaving>
                    Saving Field ...
                  </Item>
                )
              }

              // if is editing active context, then show editing mode
              if (isActiveContext) {
                return (
                  <Item key={field.key} showBorder isDateContext>
                    {isDateContext && <ItemLabel>{field.label}</ItemLabel>}

                    <Editable
                      deal={this.props.deal}
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
                  key={field.key}
                  caption={
                    isApproved || this.props.isBackOffice
                      ? null
                      : 'Pending Office Approval'
                  }
                >
                  <Fragment>
                    <Item>
                      <ItemLabel>{field.label}</ItemLabel>
                      <ItemValue>{field.getFormattedValue(value)}</ItemValue>

                      <Actions
                        field={field}
                        value={value}
                        deal={this.props.deal}
                        onClickEditContext={this.handleStartEditContext}
                        onClickRemoveContext={this.handleRemoveContext}
                      />
                    </Item>

                    {this.showApproveButton(field) && (
                      <Flex
                        justifyEnd
                        style={{
                          paddingRight: '1.5rem',
                          marginBottom: '1rem'
                        }}
                      >
                        <LinkButton
                          style={{ padding: 0, height: '1rem' }}
                          onClick={() => this.handleApproveField(field)}
                        >
                          Approve
                        </LinkButton>
                      </Flex>
                    )}
                  </Fragment>
                </ToolTip>
              )
            })}
          </ItemsContainer>
        </Container>

        {this.props.showDivider && <FactsheetDivider />}
      </Fragment>
    )
  }
}

export default connect(
  null,
  { upsertContexts, approveContext }
)(Factsheet)
