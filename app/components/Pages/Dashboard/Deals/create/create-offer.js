import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import cn from 'classnames'

import Deal from '../../../../../models/Deal'
import DealContext from '../../../../../models/DealContext'

import PageHeader from '../../../../../views/components/PageHeader'
import Button from '../../../../../views/components/Button/ActionButton'

import OfferType from './offer-type'
import EnderType from './deal-ender-type'
import DealClients from './deal-clients'
import BuyerName from './offer-buyer-name'
import DealAgents from './deal-agents'
import DealStatus from './deal-status'
import EscrowOfficers from './escrow-officer'
import DealReferrals from './deal-referrals'
import Contexts from './contexts'
import IntercomTrigger from '../../Partials/IntercomTrigger'
import {
  createRoles,
  createOffer,
  updateContext
} from '../../../../../store_actions/deals'
import { getLegalFullName } from '../utils/roles'
import { confirmation } from '../../../../../store_actions/confirmation'

class CreateOffer extends React.Component {
  constructor(props) {
    super(props)

    const { deal } = props

    const dealHasPrimaryOffer = DealContext.getHasActiveOffer(deal)

    this.state = {
      dealHasPrimaryOffer,
      saving: false,
      buyerName: '',
      dealStatus: '',
      offerType: dealHasPrimaryOffer ? 'backup' : '',
      enderType: -1,
      contexts: this.initializeContexts(),
      agents: {},
      clients: {},
      escrowOfficers: {},
      referrals: {},
      submitError: null,
      validationErrors: []
    }

    this.isFormSubmitted = false
  }

  componentDidMount() {
    const { deal } = this.props

    if (deal.roles) {
      this.initializeRoles(deal.roles)
    }
  }

  initializeContexts() {
    const { deal } = this.props

    return {
      year_built: Deal.get.field(deal, 'year_built')
    }
  }

  initializeRoles(list) {
    const { roles } = this.props
    const newState = {}

    list.forEach(id => {
      let type
      const item = roles[id]

      switch (item.role) {
        case 'Buyer':
        case 'Tenant':
          type = 'clients'
          break

        case 'BuyerAgent':
        case 'CoBuyerAgent':
          type = 'agents'
          break

        case 'BuyerReferral':
          type = 'referrals'
          break

        case 'Title':
          type = 'escrowOfficers'
          break
      }

      if (!type) {
        return false
      }

      newState[type] = {
        ...newState[type],
        [item.id]: {
          ...item,
          readOnly: true
        }
      }
    })

    this.setState(newState)
  }

  onUpsertRole(form, type) {
    this.setState(
      {
        [type]: {
          ...this.state[type],
          [form.id || form.user.id]: form
        }
      },
      () => this.validateForm()
    )
  }

  onRemoveRole(id, type) {
    this.setState(
      {
        [type]: _.omit(this.state[type], role => role.id === id)
      },
      () => this.validateForm()
    )
  }

  onChangeBuyerName(buyerName) {
    this.setState({ buyerName }, () => this.validateForm())
  }

  changeContext(field, value) {
    this.setState(
      {
        contexts: {
          ...this.state.contexts,
          [field]: value
        }
      },
      () => this.validateForm()
    )
  }

  openDeal(id) {
    browserHistory.push(`/dashboard/deals/${id}`)
  }

  changeOfferType(offerType) {
    this.isFormSubmitted = false
    this.setState({ offerType, validationErrors: [] })
  }

  changeEnderType(enderType) {
    this.setState({ enderType }, () => this.validateForm())
  }

  /**
   * handles deal status change
   */
  changeDealStatus(status) {
    this.setState({ dealStatus: status }, () => this.validateForm())
  }

  validateForm() {
    let validationTable = {}
    const { deal } = this.props
    const {
      offerType,
      contexts,
      agents,
      clients,
      escrowOfficers,
      buyerName,
      enderType,
      dealStatus
    } = this.state

    if (this.isBackupOffer()) {
      validationTable = {
        buyer_name: () => buyerName.length > 0
      }
    } else {
      validationTable = {
        offer_type: () => offerType.length > 0,
        ender_type: () => enderType !== -1,
        clients: () => _.size(clients) > 0,
        agents: () => _.size(agents) > 0,
        escrow_officers: () => {
          if (!this.isLeaseDeal()) {
            return _.size(escrowOfficers) > 0
          }

          return true
        },
        deal_status: () => dealStatus.length > 0,
        contexts: () =>
          DealContext.validateList(
            contexts,
            'Buying',
            deal.property_type,
            DealContext.getHasActiveOffer(deal)
          )
      }
    }

    const validationErrors = []

    _.each(validationTable, (validate, name) => {
      if (validate() === false) {
        validationErrors.push(name)
      }
    })

    this.setState({
      validationErrors
    })

    return validationErrors.length === 0
  }

  getAllRoles() {
    const { enderType, clients, agents, escrowOfficers, referrals } = this.state
    const roles = []

    _.each(clients, client => roles.push(_.omit(client, 'id')))
    _.each(agents, agent => roles.push(_.omit(agent, 'id')))
    _.each(escrowOfficers, co => roles.push(_.omit(co, 'id')))

    if (enderType === 'AgentDoubleEnder') {
      _.each(referrals, referral => roles.push(_.omit(referral, 'id')))
    }

    return roles.filter(role => role.readOnly !== true)
  }

  getBuyerNames() {
    const { clients } = this.state

    return _.chain(clients)
      .pick(client => !client.readOnly)
      .map(client => getLegalFullName(client, false))
      .join(', ')
      .value()
  }

  async createOffer() {
    this.isFormSubmitted = true

    if (!this.validateForm(true)) {
      return false
    }

    const { deal, notify, createOffer, createRoles } = this.props
    const { enderType, dealStatus, contexts } = this.state
    const isBackupOffer = this.isBackupOffer()
    const isPrimaryOffer = this.isPrimaryOffer()
    const order = isPrimaryOffer ? -1 : this.getMaxOrder() + 1

    let { buyerName } = this.state

    if (!isBackupOffer) {
      buyerName = this.getBuyerNames()
    }

    this.setState({ saving: true })

    try {
      await createOffer(
        deal.id,
        buyerName,
        order,
        isBackupOffer,
        deal.property_type
      )

      if (isPrimaryOffer) {
        await createRoles(deal.id, this.getAllRoles())

        // create/update contexts
        await this.saveContexts({
          ...contexts,
          listing_status: dealStatus,
          ender_type: enderType
        })
      }

      notify({
        title: 'Offer created',
        message: `The offer(${buyerName}) has been created`,
        status: 'success',
        dismissible: true,
        dismissAfter: 6000
      })

      return this.backToDeal()
    } catch (e) {
      notify({
        title: 'Could not create offer',
        message: e.response && e.response.body ? e.response.body.message : null,
        status: 'error',
        dismissible: true
      })
    }

    this.setState({ saving: false })
  }

  async saveContexts(contexts) {
    const { deal, updateContext } = this.props

    const contextsObject = {}

    _.each(contexts, (value, name) => {
      if (_.isUndefined(value) || value === null || value.length === 0) {
        return false
      }

      const field = Deal.get.context(deal, name)

      contextsObject[name] = {
        value,
        approved: field ? field.needs_approval : false
      }
    })

    return updateContext(deal.id, contextsObject)
  }

  getMaxOrder() {
    let max = 0

    const { deal, checklists } = this.props

    if (!deal.checklists) {
      return max
    }

    deal.checklists.forEach(id => {
      const list = checklists[id]

      if (list.order > max) {
        max = list.order
      }
    })

    return max
  }

  isBackupOffer() {
    return this.state.offerType === 'backup'
  }

  isPrimaryOffer() {
    return this.state.offerType === 'primary'
  }

  isLeaseDeal() {
    const { deal } = this.props

    return deal.property_type.includes('Lease')
  }

  getDealContexts() {
    const { deal } = this.props

    return DealContext.getItems('Buying', deal.property_type, true)
  }

  backToDeal = () => {
    const { deal } = this.props

    browserHistory.push(`/dashboard/deals/${deal.id}`)
  }

  cancelCreateOffer = () => {
    const { confirmation } = this.props

    confirmation({
      message: 'Cancel offer creation?',
      description: 'By canceling you will lose your work.',
      confirmLabel: 'Yes, cancel',
      cancelLabel: 'No, don\'t cancel',
      onConfirm: this.backToDeal
    })
  }

  /**
   * check an specific field has error or not
   */
  hasError(field) {
    const { validationErrors } = this.state

    return this.isFormSubmitted && validationErrors.includes(field)
  }

  /**
   * check commission is required or not
   */
  get IsDoubleEnded() {
    return ['AgentDoubleEnder', 'OfficeDoubleEnder'].includes(
      this.state.enderType
    )
  }

  render() {
    const {
      saving,
      submitError,
      contexts,
      referrals,
      escrowOfficers,
      dealStatus,
      offerType,
      enderType,
      agents,
      clients,
      buyerName,
      dealHasPrimaryOffer,
      validationErrors
    } = this.state
    const { deal } = this.props

    const dealContexts = this.getDealContexts()
    const isDoubleEndedAgent = enderType === 'AgentDoubleEnder'

    return (
      <div className="deal-create-offer">
        <PageHeader
          title="Add New Offer"
          onClickBackButton={this.cancelCreateOffer}
        />

        <div className="form">
          <OfferType
            hasError={this.hasError('offer_type')}
            dealHasPrimaryOffer={dealHasPrimaryOffer}
            offerType={offerType}
            deal={deal}
            onChangeOfferType={offer => this.changeOfferType(offer)}
          />

          {this.isBackupOffer() && (
            <BuyerName
              hasError={this.hasError('buyer_name')}
              buyerName={buyerName}
              onChangeBuyerName={name => this.onChangeBuyerName(name)}
            />
          )}

          {this.isPrimaryOffer() && (
            <div>
              <DealClients
                hasError={this.hasError('clients')}
                dealSide="Buying"
                clients={clients}
                onUpsertClient={form => this.onUpsertRole(form, 'clients')}
                onRemoveClient={id => this.onRemoveRole(id, 'clients')}
              />

              <EnderType
                isRequired
                hasError={this.hasError('ender_type')}
                enderType={enderType}
                showAgentDoubleEnder
                onChangeEnderType={type => this.changeEnderType(type)}
              />

              <DealAgents
                hasError={this.hasError('agents')}
                scenario="CreateOffer"
                showDealSideAs="Buying"
                dealSide={deal.deal_type}
                isDoubleEnded={this.IsDoubleEnded}
                isCommissionRequired={this.IsDoubleEnded}
                agents={agents}
                onUpsertAgent={form => this.onUpsertRole(form, 'agents')}
                onRemoveAgent={id => this.onRemoveRole(id, 'agents')}
              />

              {!this.isLeaseDeal() && (
                <EscrowOfficers
                  hasError={this.hasError('escrow_officers')}
                  escrowOfficers={escrowOfficers}
                  onUpsertEscrowOfficer={form =>
                    this.onUpsertRole(form, 'escrowOfficers')
                  }
                  onRemoveEscrowOfficer={id =>
                    this.onRemoveRole(id, 'escrowOfficers')
                  }
                />
              )}

              <DealStatus
                hasError={this.hasError('deal_status')}
                property_type={deal.property_type}
                dealStatus={dealStatus}
                onChangeDealStatus={status => this.changeDealStatus(status)}
              />

              {isDoubleEndedAgent && (
                <DealReferrals
                  dealSide="Buying"
                  referrals={referrals}
                  onUpsertReferral={form =>
                    this.onUpsertRole(form, 'referrals')
                  }
                  onRemoveReferral={id => this.onRemoveRole(id, 'referrals')}
                />
              )}

              <Contexts
                hasError={this.hasError('contexts')}
                contexts={contexts}
                onChangeContext={(field, value) =>
                  this.changeContext(field, value)
                }
                fields={dealContexts}
              />
            </div>
          )}
        </div>

        <div className="actions">
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
                  Sorry, something went wrong while adding an offer. Please try
                  again.
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
            className={cn('create-offer-button', {
              disabled: saving || offerType.length === 0
            })}
            disabled={saving || offerType.length === 0}
            onClick={() => this.createOffer()}
          >
            {saving ? 'Creating Offer ...' : 'Create Offer'}
          </Button>

          <div className="error-summary">
            {this.isFormSubmitted &&
              validationErrors.length > 0 && (
                <span>
                  {validationErrors.length} required fields remaining to
                  complete.
                </span>
              )}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ deals }, props) {
  return {
    deal: deals.list[props.params.id],
    roles: deals.roles,
    checklists: deals.checklists
  }
}

export default connect(
  mapStateToProps,
  {
    createOffer,
    createRoles,
    updateContext,
    notify,
    confirmation
  }
)(CreateOffer)
