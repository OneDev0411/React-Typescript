import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import cn from 'classnames'
import Deal from '../../../../../models/Deal'
import DealContext from '../../../../../models/DealContext'
import Navbar from './nav'
import DealSide from './deal-side'
import DealPropertyType from './deal-property-type'
import DealClients from './deal-clients'
import DealAgents from './deal-agents'
import DealReferrals from './deal-referrals'
import DealStatus from './deal-status'
import DealAddress from './deal-address'
import IntercomTrigger from '../../Partials/IntercomTrigger'
import Contexts from './contexts'
import { confirmation } from '../../../../../store_actions/confirmation'
import {
  createDeal,
  createRoles,
  closeEsignWizard,
  setSelectedTask,
  updateContext
} from '../../../../../store_actions/deals'
import OpenDeal from '../utils/open-deal'

class CreateDeal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      saving: false,
      dealSide: '',
      dealPropertyType: '',
      dealAddress: null,
      dealStatus: '',
      contexts: {},
      agents: {},
      clients: {},
      referrals: {},
      submitError: null
    }
  }

  onUpsertRole(form, type) {
    this.setState({
      [type]: {
        ...this.state[type],
        [form.id]: form
      }
    })
  }

  onRemoveRole(id, type) {
    this.setState({
      [type]: _.omit(this.state[type], role => role.id === id)
    })
  }

  onCreateAddress(component) {
    this.setState({ dealAddress: component })
  }

  isFormValidated() {
    const {
      dealSide,
      dealPropertyType,
      contexts,
      dealStatus,
      agents,
      clients
    } = this.state
    const statusCompleted = (dealSide === 'Buying') ? dealStatus.length > 0 : true

    return (
      dealSide.length > 0 &&
      dealPropertyType.length > 0 &&
      statusCompleted &&
      _.size(agents) > 0 &&
      _.size(clients) > 0 &&
      DealContext.validateList(contexts, dealSide, dealPropertyType)
    )
  }

  requestChangeDealSide(nextDealSide) {
    const {
      agents, clients, referrals, dealSide
    } = this.state

    if (dealSide === nextDealSide) {
      return false
    }

    if (_.size(agents) > 0 || _.size(clients) > 0 || _.size(referrals) > 0) {
      return this.props.confirmation({
        message: 'Changing deal side will remove all contacts.',
        confirmLabel: 'Okay, Continue',
        onConfirm: () => this.changeDealSide(nextDealSide)
      })
    }

    this.changeDealSide(nextDealSide)
  }

  changeDealSide(dealSide) {
    this.setState({
      dealSide,
      dealStatus: '',
      agents: {},
      clients: {},
      referrals: {}
    })
  }

  changeDealStatus(status) {
    this.setState({ dealStatus: status })
  }

  changeContext(field, value) {
    this.setState({
      contexts: {
        ...this.state.contexts,
        [field]: value
      }
    })
  }

  async createDeal() {
    const {
      contexts,
      dealSide,
      dealPropertyType,
      dealAddress,
      dealStatus,
      submitError
    } = this.state
    const { user, notify, createDeal, createRoles, updateContext } = this.props
    const isBuyingDeal = dealSide === 'Buying'

    const dealObject = {
      property_type: dealPropertyType,
      deal_type: dealSide,
      roles: this.getRoles(),
      deal_context: {
        ...contexts,
        listing_status: isBuyingDeal ? dealStatus : 'Active'
      }
    }

    if (dealAddress) {
      if (dealAddress.id) {
        dealObject.listing = dealAddress.id
      } else {
        dealObject.deal_context = this.getAddressContext()
      }
    }

    // show loading
    this.setState({ saving: true })

    try {
      // // create deal
      const deal = await Deal.create(user, dealObject)

      // dispatch new deal
      await createDeal(deal)
      this.setState({ saving: false })

      return OpenDeal(deal.id)
    } catch (e) {
      this.setState({
        saving: false,
        submitError: true
      })
    }
  }

  getAddressContext() {
    const { dealAddress } = this.state
    const address = dealAddress.address_components
    const {
      street_number,
      street_name,
      city,
      state,
      unit_number,
      postal_code
    } = address

    const full_address = [street_number, street_name, city, state, postal_code]
      .join(' ')
      .trim()

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

  getDealContexts() {
    const { dealSide, dealPropertyType } = this.state
    if (dealSide.length === 0 || dealPropertyType.length === 0) {
      return []
    }

    return DealContext.getItems(dealSide, dealPropertyType)
  }

  getRoles() {
    const { agents, clients, referrals } = this.state
    const roles = []

    _.each(clients, client => roles.push(_.omit(client, 'id')))
    _.each(agents, agent => roles.push(_.omit(agent, 'id')))
    _.each(referrals, referral => roles.push(_.omit(referral, 'id')))

    return roles
  }

  render() {
    const {
      saving,
      dealSide,
      dealStatus,
      dealPropertyType,
      dealAddress,
      contexts,
      agents,
      clients,
      referrals,
      submitError
    } = this.state
    const canCreateDeal = this.isFormValidated() && !saving
    const dealContexts = this.getDealContexts()

    return (
      <div className="deal-create">
        <Navbar title="Create New Deal" />

        <div className="form">
          <div className="swoosh">Swoosh! Another one in the bag.</div>

          <DealSide
            selectedSide={dealSide}
            onChangeDealSide={dealSide => this.requestChangeDealSide(dealSide)}
          />

          {dealSide.length > 0 && (
            <div>
              <DealPropertyType
                selectedType={dealPropertyType}
                onChangeDealType={dealPropertyType =>
                  this.setState({ dealPropertyType })
                }
              />

              <DealClients
                dealSide={dealSide}
                clients={clients}
                onUpsertClient={form => this.onUpsertRole(form, 'clients')}
                onRemoveClient={id => this.onRemoveRole(id, 'clients')}
              />

              <DealAgents
                scenario="CreateDeal"
                dealSide={dealSide}
                agents={agents}
                onUpsertAgent={form => this.onUpsertRole(form, 'agents')}
                onRemoveAgent={id => this.onRemoveRole(id, 'agents')}
              />

              <DealReferrals
                dealSide={dealSide}
                referrals={referrals}
                onUpsertReferral={form => this.onUpsertRole(form, 'referrals')}
                onRemoveReferral={id => this.onRemoveRole(id, 'referrals')}
              />

              {dealSide === 'Buying' && (
                <DealStatus
                  dealStatus={dealStatus}
                  onChangeDealStatus={status => this.changeDealStatus(status)}
                />
              )}

              <DealAddress
                dealAddress={dealAddress}
                dealSide={dealSide}
                onCreateAddress={(component, type) =>
                  this.onCreateAddress(component, type)
                }
                onRemoveAddress={() => this.setState({ dealAddress: null })}
              />

              {
                dealPropertyType.length > 0 && dealContexts.length > 0 &&
                <Contexts
                  contexts={contexts}
                  onChangeContext={(field, value) =>
                    this.changeContext(field, value)
                  }
                  fields={dealContexts}
                />
              }
            </div>
          )}

          {!saving &&
            submitError && (
              <div
                className="c-alert c-alert--error"
                style={{
                  float: 'left',
                  marginBottom: '2rem'
                }}
              >
                <span>
                  Sorry, something went wrong while creating the deal. Please try again.
                </span>
                <IntercomTrigger
                  render={({ activeIntercom, intercomIsActive }) => (
                    <button
                      onClick={!intercomIsActive ? activeIntercom : () => false}
                      className="btn btn-primary c-button--link"
                    >
                      Support
                    </button>
                  )}
                />
              </div>
            )}

          <Button
            className={cn('btn btn-primary create-deal-button', {
              disabled: !canCreateDeal
            })}
            onClick={() => this.createDeal()}
            disabled={!canCreateDeal}
          >
            {saving ? 'Creating ...' : 'Create Deal'}
          </Button>
        </div>
      </div>
    )
  }
}

export default connect(
  ({ deals, user }) => ({
    user,
    confirmation
  }),
  {
    confirmation,
    createDeal,
    createRoles,
    closeEsignWizard,
    setSelectedTask,
    updateContext,
    notify
  }
)(CreateDeal)
