import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { browserHistory } from 'react-router'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import Deal from '../../../../../models/Deal'
import Navbar from './nav'
import DealSide from './deal-side'
import DealPropertyType from './deal-property-type'
import DealClients from './deal-clients'
import DealAgents from './deal-agents'
import DealAddress from './deal-address'
import { confirmation } from '../../../../../store_actions/confirmation'
import {
  createDeal,
  createRoles,
  closeEsignWizard,
  setSelectedTask
} from '../../../../../store_actions/deals'


class CreateDeal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      saving: false,
      dealSide: '',
      dealPropertyType: '',
      dealAddress: null,
      agents: {},
      clients: {}
    }
  }

  onUpsertRole(form, type) {
    this.setState({
      [type]: {
        ...this.state[type],
        [form.email]: form
      }
    })
  }

  onRemoveRole(id, type) {
    this.setState({
      [type]: _.omit(this.state[type], (role, roleId) => id === roleId)
    })
  }

  onCreateAddress(component, type) {
    this.setState({ dealAddress: component })
  }

  isFormValidated() {
    const { dealSide, dealPropertyType, agents, clients } = this.state

    return dealSide.length > 0 &&
      dealPropertyType.length > 0 &&
      _.size(agents) > 0 &&
      _.size(clients) > 0
  }

  requestChangeDealSide(dealSide) {
    const { agents, clients } = this.state

    if (_.size(agents) > 0 || _.size(clients) > 0) {
      return this.props.confirmation({
        message: 'Changing deal side will remove all contacts.',
        confirmLabel: 'Okay, Continue',
        onConfirm: () => this.changeDealSide(dealSide)
      })
    }

    this.changeDealSide(dealSide)
  }

  changeDealSide(dealSide) {
    this.setState({
      dealSide,
      agents: {},
      clients: {}
    })
  }

  async createDeal() {
    const { dealSide, dealPropertyType, dealAddress } = this.state
    const { user, notify, createDeal, createRoles } = this.props

    const dealObject = {
      property_type: dealPropertyType,
      deal_type: dealSide
    }

    if (dealAddress.id) {
      dealObject.listing = dealAddress.id
    } else {
      dealObject.deal_context = this.getDealContext()
    }

    // show loading
    this.setState({ saving: true })

    try {
      // create deal
      const deal = await Deal.create(user, dealObject)

      // dispatch new deal
      await createDeal(deal)

      // add roles
      await createRoles(deal.id, this.getRoles())

      return this.openDeal(deal.id)

    } catch(e) {
      // notify user
      notify({
        title: 'Can not create deal',
        message: e.response && e.response.body ? e.response.body.message : null,
        status: 'error',
        dismissible: true
      })
    }

    this.setState({ saving: false })
  }

  getDealContext() {
    const { dealAddress } = this.state
    const address = dealAddress.address_components
    const { street_number, street_name, city, state, unit_number, postal_code } = address

    const full_address = [
      street_number,
      street_name,
      city,
      state,
      postal_code
    ].join(' ').trim()

    return {
      full_address,
      street_number,
      unit_number,
      city,
      state,
      street_name,
      postal_code
    }
  }

  getRoles() {
    const { agents, clients } = this.state
    const roles = []
    _.each(clients, client => roles.push(client))
    _.each(agents, agent => roles.push(agent))

    return roles
  }

  openDeal(id) {
    // reset esign flow
    this.props.closeEsignWizard()

    // reset selected task
    this.props.setSelectedTask(null)

    browserHistory.push(`/dashboard/deals/${id}`)
  }

  render() {
    const { saving, dealSide, dealPropertyType, dealAddress, agents, clients } = this.state
    const canAddRole = dealSide.length > 0
    const canAddAddress = dealSide.length > 0

    return (
      <div className="deal-create">
        <Navbar />
        <div className="form">
          <div className="swoosh">
            Swoosh! Another one in the bag.
          </div>

          <DealSide
            selectedSide={dealSide}
            onChangeDealSide={(dealSide) => this.requestChangeDealSide(dealSide)}
          />

          <DealPropertyType
            selectedType={dealPropertyType}
            onChangeDealType={(dealPropertyType) => this.setState({ dealPropertyType })}
          />

          <DealClients
            display={canAddRole}
            dealSide={dealSide}
            clients={clients}
            onUpsertClient={form => this.onUpsertRole(form, 'clients')}
            onRemoveClient={id => this.onRemoveRole(id, 'clients')}
          />

          <DealAgents
            display={canAddRole}
            dealSide={dealSide}
            agents={agents}
            onUpsertAgent={form => this.onUpsertRole(form, 'agents')}
            onRemoveAgent={id => this.onRemoveRole(id, 'agents')}
          />

          <DealAddress
            display={canAddAddress}
            dealAddress={dealAddress}
            dealSide={dealSide}
            onCreateAddress={(component, type) => this.onCreateAddress(component, type)}
            onRemoveAddress={() => this.setState({ dealAddress: null })}
          />

          <Button
            className="btn btn-primary create-deal-button"
            onClick={() => this.createDeal()}
            disabled={saving || !this.isFormValidated()}
          >
            {saving ? 'Creating ...' : 'Create Deal'}
          </Button>

        </div>
      </div>
    )
  }
}

export default connect(({ deals, user }) => ({
  user,
  confirmation
}), {
  confirmation,
  createDeal,
  createRoles,
  closeEsignWizard,
  setSelectedTask,
  notify
})(CreateDeal)
