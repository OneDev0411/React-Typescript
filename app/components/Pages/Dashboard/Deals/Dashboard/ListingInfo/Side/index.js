import React from 'react'
import { connect } from 'react-redux'

import Deal from 'models/Deal'
import DealContext from 'models/Deal/helpers/dynamic-context'
import { upsertContexts } from 'actions/deals'

import { BasicDropdown } from 'components/BasicDropdown'

class DealSide extends React.Component {
  options = [
    {
      value: null,
      label: this.props.deal.deal_type
    },
    {
      value: 'AgentDoubleEnder',
      label: `${this.props.deal.deal_type} (Agent Double Ender)`
    },
    {
      value: 'OfficeDoubleEnder',
      label: `${this.props.deal.deal_type} (Office Double Ender)`
    }
  ]

  get EnderType() {
    return Deal.get.field(this.props.deal, 'ender_type')
  }

  getSideName = () => {
    const enderType = this.EnderType
    const dealType =
      this.props.deal.deal_type === 'Buying' ? 'Buying' : 'Listing'

    if (enderType === 'AgentDoubleEnder') {
      return 'Both'
    }

    if (enderType === 'OfficeDoubleEnder') {
      return `${dealType} (Office DE)`
    }

    return dealType
  }

  handleSelectEnderType = item => {
    if (item.value === this.EnderType) {
      return false
    }

    this.props.upsertContexts(this.props.deal.id, [
      {
        definition: DealContext.getDefinitionId(
          this.props.deal.brand.id,
          'ender_type'
        ),
        checklist: DealContext.getChecklist(this.props.deal, 'ender_type'),
        value: item.value,
        approved: true
      }
    ])
  }

  render() {
    if (this.props.isBackOffice === false) {
      return <span>Side: {this.getSideName()}</span>
    }

    return (
      <BasicDropdown
        noBorder
        fullHeight
        buttonStyle={{
          padding: 0,
          margin: 0
        }}
        items={this.options}
        selectedItem={this.options.find(item => item.value === this.EnderType)}
        onSelect={this.handleSelectEnderType}
      />
    )
  }
}

export default connect(
  null,
  { upsertContexts }
)(DealSide)
