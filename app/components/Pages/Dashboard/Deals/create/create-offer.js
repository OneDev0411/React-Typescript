import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { browserHistory } from 'react-router'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import cn from 'classnames'
import Deal from '../../../../../models/Deal'
import DealContext from '../../../../../models/DealContext'
import Navbar from './nav'
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
      contexts: {},
      agents: {},
      clients: {},
      escrowOfficers: {},
      referrals: {},
      submitError: null
    }
  }

  componentDidMount() {
    const { deal } = this.props

    if (deal.roles) {
      this.prepopulateRoles(deal.roles)
    }
  }

  prepopulateRoles(list) {
    const { roles } = this.props

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

      if (type) {
        item.disabled = true
        this.onUpsertRole(item, type)
      }
    })
  }

  onUpsertRole(form, type) {
    this.setState({
      [type]: {
        ...this.state[type],
        [form.id || form.user.id]: form
      }
    })
  }

  onRemoveRole(id, type) {
    this.setState({
      [type]: _.omit(this.state[type], role => role.id === id)
    })
  }

  onCreateAddress(component, type) {
    this.setState({ dealAddress: component })
  }

  changeContext(field, value) {
    let { contexts } = this.state

    if (value) {
      this.setState({
        contexts: {
          ...contexts,
          [field]: value
        }
      })
    } else if (contexts[field]) {
      this.setState({
        contexts: _.omit(contexts, field)
      })
    }
  }

  openDeal(id) {
    browserHistory.push(`/dashboard/deals/${id}`)
  }

  changeOfferType(offerType) {
    this.setState({ offerType })
  }

  changeEnderType(enderType) {
    this.setState({ enderType })
  }

  /**
   * handles deal status change
   */
  changeDealStatus(status) {
    this.setState({ dealStatus: status })
  }

  isFormValidated() {
    const { deal } = this.props
    const {
      offerType,
      contexts,
      agents,
      clients,
      buyerName,
      enderType,
      dealStatus
    } = this.state

    if (this.isBackupOffer()) {
      return buyerName.length > 0
    }

    return (
      offerType.length > 0 &&
      enderType !== -1 &&
      _.size(clients) > 0 && // validate clients
      _.size(agents) > 0 && // validate agents
      dealStatus.length > 0 &&
      DealContext.validateList(
        contexts,
        'Buying',
        deal.property_type,
        DealContext.getHasActiveOffer(deal)
      )
    )
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

    return roles.filter(role => role.disabled !== true)
  }

  async createOffer() {
    const { deal, notify, createOffer, createRoles } = this.props
    const { enderType, dealStatus, contexts, clients } = this.state
    const isBackupOffer = this.isBackupOffer()
    const isPrimaryOffer = this.isPrimaryOffer()
    const order = isPrimaryOffer ? -1 : this.getMaxOrder() + 1

    let { buyerName } = this.state

    if (!isBackupOffer) {
      buyerName = _.map(
        clients,
        client => `${client.legal_first_name} ${client.legal_last_name}`
      ).join(', ')
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
        // create roles
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
      const field = Deal.get.context(deal, name)

      contextsObject[name] = {
        value,
        approved: field ? field.approved_at !== null : false
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

  getDealContexts() {
    const { deal } = this.props

    return DealContext.getItems('Buying', deal.property_type, true)
  }

  backToDeal() {
    const { deal } = this.props

    browserHistory.push(`/dashboard/deals/${deal.id}`)
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
      dealHasPrimaryOffer
    } = this.state
    const { deal } = this.props

    const canCreateOffer = this.isFormValidated() && !saving
    const dealContexts = this.getDealContexts()
    const isDoubleEnderAgent = enderType === 'AgentDoubleEnder'

    return (
      <div className="deal-create-offer">
        <Navbar title="Add New Offer" onClose={() => this.backToDeal()} />

        <div className="form">
          <OfferType
            dealHasPrimaryOffer={dealHasPrimaryOffer}
            offerType={offerType}
            deal={deal}
            onChangeOfferType={offer => this.changeOfferType(offer)}
          />

          {this.isBackupOffer() && (
            <BuyerName
              buyerName={buyerName}
              onChangeBuyerName={buyerName => this.setState({ buyerName })}
            />
          )}

          {this.isPrimaryOffer() && (
            <div>
              <DealClients
                dealSide="Buying"
                clients={clients}
                onUpsertClient={form => this.onUpsertRole(form, 'clients')}
                onRemoveClient={id => this.onRemoveRole(id, 'clients')}
              />

              <EnderType
                isRequired
                enderType={enderType}
                showAgentDoubleEnder
                onChangeEnderType={type => this.changeEnderType(type)}
              />

              <DealAgents
                scenario="CreateOffer"
                dealSide="Buying"
                shouldPrepopulateAgent={isDoubleEnderAgent}
                agents={agents}
                onUpsertAgent={form => this.onUpsertRole(form, 'agents')}
                onRemoveAgent={id => this.onRemoveRole(id, 'agents')}
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
                property_type={deal.property_type}
                dealStatus={dealStatus}
                onChangeDealStatus={status => this.changeDealStatus(status)}
              />

              {isDoubleEnderAgent && (
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
                contexts={contexts}
                onChangeContext={(field, value) =>
                  this.changeContext(field, value)
                }
                fields={dealContexts}
              />
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
            className={cn('btn btn-primary create-offer-button', {
              disabled: !canCreateOffer
            })}
            onClick={() => this.createOffer()}
            disabled={!canCreateOffer}
          >
            {saving ? 'Creating Offer ...' : 'Create Offer'}
          </Button>
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

export default connect(mapStateToProps, {
  createOffer,
  createRoles,
  updateContext,
  notify
})(CreateOffer)
