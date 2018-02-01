import React, { Fragment } from 'react'
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
import EscrowOfficers from './escrow-officer'
import Contexts from './contexts'
import EnderType from './deal-ender-type'
import Alert from '../../Partials/Alert'
import { confirmation } from '../../../../../store_actions/confirmation'
import {
  createDeal,
  closeEsignWizard,
  setSelectedTask
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
      enderType: -1,
      contexts: {},
      agents: {},
      sellingAgents: {},
      clients: {},
      sellingClients: {},
      referrals: {},
      escrowOfficers: {},
      submitError: null
    }
  }

  /**
   * handle Update or Insert a role
   * roles: agent, sellingAgent, client, sellingClient, referrals, escrowOfficers
   */
  onUpsertRole(form, type) {
    this.setState({
      [type]: {
        ...this.state[type],
        [form.id]: form
      }
    })
  }

  /**
   * handles remove a role
   */
  onRemoveRole(id, type) {
    this.setState({
      [type]: _.omit(this.state[type], role => role.id === id)
    })
  }

  /**
   * handles create an mls or manual address
   */
  onCreateAddress(component) {
    this.setState({ dealAddress: component })
  }

  /**
   * validate form
   */
  isFormValidated() {
    const {
      dealSide,
      dealPropertyType,
      dealAddress,
      contexts,
      dealStatus,
      agents,
      sellingAgents,
      clients,
      sellingClients
    } = this.state

    const statusCompleted = dealSide === 'Buying' ? dealStatus.length > 0 : true

    // on Buying side, user should add SellerClient and SellerAgent
    const validSellingAgents =
      dealSide === 'Buying' ? _.size(sellingAgents) > 0 : true
    const validSellingClients =
      dealSide === 'Buying' ? _.size(sellingClients) > 0 : true

    // agents and clients are required on both side
    const validAgents = _.size(agents) > 0
    const validClients = _.size(clients) > 0

    return (
      dealSide.length > 0 &&
      dealPropertyType.length > 0 &&
      statusCompleted &&
      dealAddress &&
      validSellingAgents &&
      validSellingClients &&
      validAgents &&
      validClients &&
      DealContext.validateList(contexts, dealSide, dealPropertyType)
    )
  }

  /**
   * when user tries to change deal side, we should show a confirmation modal
   */
  requestChangeDealSide(nextDealSide) {
    const { dealSide } = this.state

    if (dealSide === nextDealSide) {
      return false
    }

    const showConfirmation = [
      'agents',
      'sellingAgents',
      'clients',
      'sellingClients',
      'referrals',
      'escrowOfficers'
    ].some(name => _.size(this.state[name]) > 0)

    if (showConfirmation) {
      return this.props.confirmation({
        message: 'Changing deal side will remove all contacts.',
        confirmLabel: 'Okay, Continue',
        onConfirm: () => this.changeDealSide(nextDealSide)
      })
    }

    this.changeDealSide(nextDealSide)
  }

  /**
   * handles changing deal side
   * when deal side changes, we should reset roles and ender_type
   */
  changeDealSide(dealSide) {
    this.setState({
      dealSide,
      dealStatus: '',
      agents: {},
      clients: {},
      referrals: {},
      sellingClients: {},
      sellingAgents: {},
      escrowOfficers: {},
      enderType: -1,
      contexts: {}
    })
  }

  /**
   * handles deal status change
   */
  changeDealStatus(status) {
    this.setState({ dealStatus: status })
  }

  /**
   * handles deal contexts change
   */
  changeContext(field, value) {
    this.setState({
      contexts: {
        ...this.state.contexts,
        [field]: value
      }
    })
  }

  /**
   * handles deal ender_type context change
   */
  changeEnderType(enderType) {
    this.setState({ enderType })
  }

  /**
   * creates deal
   */
  async createDeal() {
    const {
      contexts,
      dealSide,
      dealPropertyType,
      dealAddress,
      dealStatus,
      enderType
    } = this.state
    const { user, createDeal } = this.props
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

    if (enderType !== -1) {
      dealObject.deal_context.ender_type = enderType
    }

    if (dealAddress) {
      if (dealAddress.id) {
        dealObject.listing = dealAddress.id
      } else {
        dealObject.deal_context = {
          ...dealObject.deal_context,
          ...this.getAddressContext()
        }
      }
    }

    // show loading
    this.setState({ saving: true })

    try {
      // create deal
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

  /**
   * create standard address context when user enters manual address
   */
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

  /**
   * get context for deal side (Buying or Selling)
   */
  getDealContexts() {
    const { dealSide, dealPropertyType } = this.state

    if (dealSide.length === 0 || dealPropertyType.length === 0) {
      return []
    }

    return DealContext.getItems(dealSide, dealPropertyType)
  }

  /**
   * flatten all entered roles
   */
  getRoles() {
    const {
      agents,
      clients,
      sellingAgents,
      sellingClients,
      referrals,
      escrowOfficers
    } = this.state

    const roles = []

    _.each(clients, client => roles.push(_.omit(client, 'id')))
    _.each(sellingClients, client => roles.push(_.omit(client, 'id')))

    _.each(agents, agent => roles.push(_.omit(agent, 'id')))
    _.each(sellingAgents, agent => roles.push(_.omit(agent, 'id')))

    _.each(referrals, referral => roles.push(_.omit(referral, 'id')))
    _.each(escrowOfficers, officer => roles.push(_.omit(officer, 'id')))

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
      escrowOfficers,
      agents,
      sellingAgents,
      clients,
      sellingClients,
      referrals,
      enderType,
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

          <DealPropertyType
            selectedType={dealPropertyType}
            onChangeDealType={dealPropertyType =>
              this.setState({ dealPropertyType })
            }
          />

          {dealSide.length > 0 &&
            dealPropertyType.length > 0 && (
              <div>
                <DealClients
                  dealSide={dealSide}
                  clients={clients}
                  onUpsertClient={form => this.onUpsertRole(form, 'clients')}
                  onRemoveClient={id => this.onRemoveRole(id, 'clients')}
                />

                <DealReferrals
                  dealSide={dealSide}
                  referrals={referrals}
                  onUpsertReferral={form => this.onUpsertRole(form, 'referrals')}
                  onRemoveReferral={id => this.onRemoveRole(id, 'referrals')}
                />

                <DealAgents
                  scenario="CreateDeal"
                  dealSide={dealSide}
                  agents={agents}
                  onUpsertAgent={form => this.onUpsertRole(form, 'agents')}
                  onRemoveAgent={id => this.onRemoveRole(id, 'agents')}
                />

                {dealSide === 'Buying' && (
                  <Fragment>
                    <EnderType
                      isRequired={false}
                      enderType={enderType}
                      showAgentDoubleEnder={false}
                      onChangeEnderType={type => this.changeEnderType(type)}
                    />

                    <DealAgents
                      scenario="CreateDeal"
                      dealSide="Selling"
                      agents={sellingAgents}
                      shouldPrepopulateAgent={false}
                      isCommissionRequired={false}
                      onUpsertAgent={form =>
                        this.onUpsertRole(form, 'sellingAgents')
                      }
                      onRemoveAgent={id => this.onRemoveRole(id, 'sellingAgents')}
                    />

                    <DealClients
                      dealSide="Selling"
                      clients={sellingClients}
                      ctaTitle="Add seller"
                      onUpsertClient={form =>
                        this.onUpsertRole(form, 'sellingClients')
                      }
                      onRemoveClient={id => this.onRemoveRole(id, 'sellingClients')}
                    />

                    <EscrowOfficers
                      escrowOfficers={escrowOfficers}
                      onUpsertEscrowOfficer={form =>
                        this.onUpsertRole(form, 'escrowOfficers')
                      }
                      onRemoveEscrowOfficer={id =>
                        this.onRemoveRole(id, 'escrowOfficers')
                      }
                    />

                    <DealStatus
                      dealStatus={dealStatus}
                      onChangeDealStatus={status => this.changeDealStatus(status)}
                    />
                  </Fragment>
                )}

                <DealAddress
                  dealAddress={dealAddress}
                  dealSide={dealSide}
                  onCreateAddress={(component, type) =>
                    this.onCreateAddress(component, type)
                  }
                  onRemoveAddress={() => this.setState({ dealAddress: null })}
                />

                {dealContexts.length > 0 && (
                  <Contexts
                    contexts={contexts}
                    onChangeContext={(field, value) =>
                      this.changeContext(field, value)
                    }
                    fields={dealContexts}
                  />
                )}
              </div>
            )}

          {!saving &&
            submitError && (
              <Alert
                code={500}
                type="error"
                style={{ float: 'left', marginBottom: '2rem' }}
              />
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
  ({ user }) => ({
    user,
    confirmation
  }),
  {
    confirmation,
    createDeal,
    closeEsignWizard,
    setSelectedTask,
    notify
  }
)(CreateDeal)
