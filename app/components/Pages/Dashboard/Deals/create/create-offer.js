import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import moment from 'moment'
import { Helmet } from 'react-helmet'

import { Button } from '@material-ui/core'

import Deal from 'models/Deal'
import DealContext from 'models/Deal/helpers/dynamic-context'
import { getDealStatuses } from 'models/Deal/status/get-statuses'

import { FullPageHeader } from 'components/FullPageHeader'

import { confirmation } from 'actions/confirmation'

import IntercomTrigger from 'components/IntercomTrigger'

import { createRoles, createOffer, upsertContexts } from 'actions/deals'

import EnderType from './deal-ender-type'
import DealClients from './deal-clients'
import BuyerName from './offer-buyer-name'
import DealAgents from './deal-agents'
import DealStatus from './deal-status'
import EscrowOfficers from './escrow-officer'
import DealReferrals from './deal-referrals'
import Contexts from './contexts'

import { getLegalFullName } from '../utils/roles'

class CreateOffer extends React.Component {
  constructor(props) {
    super(props)

    const dealHasPrimaryOffer = DealContext.getHasActiveOffer(props.deal)

    this.state = {
      dealHasPrimaryOffer,
      saving: false,
      buyerName: '',
      dealStatus: '',
      offerType: 'primary',
      enderType: -1,
      contexts: this.initializeContexts(),
      agents: {},
      clients: {},
      escrowOfficers: {},
      referrals: {},
      submitError: null,
      validationErrors: [],
      statuses: []
    }

    this.isFormSubmitted = false
  }

  componentDidMount() {
    const { deal } = this.props

    if (deal.roles) {
      this.initializeRoles(deal.roles)
    }

    this.loadStatuses()
  }

  initializeContexts = () => {
    const contexts = {}
    const { deal } = this.props

    const dealContexts = this.getDealContexts()

    const indexedContexts = _.indexBy(dealContexts, 'key')

    _.each(indexedContexts, context => {
      let value = Deal.get.field(deal, context.key)

      if (value !== null && context.data_type === 'Date') {
        value = moment.utc(value * 1000).format()
      }

      contexts[context.key] = value !== null ? value : ''
    })

    return contexts
  }

  initializeRoles = list => {
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
          isEditable: false,
          isRemovable: false
        }
      }
    })

    this.setState(newState)
  }

  onUpsertRole = (form, type) => {
    this.setState(
      state => ({
        [type]: {
          ...state[type],
          [form.id || form.user.id]: form
        }
      }),
      () => this.validateForm()
    )
  }

  onRemoveRole = (id, type) => {
    this.setState(
      state => ({
        [type]: _.omit(state[type], role => role.id === id)
      }),
      () => this.validateForm()
    )
  }

  onChangeBuyerName = buyerName => {
    this.setState({ buyerName }, () => this.validateForm())
  }

  changeContext = (field, value) => {
    this.setState(
      state => ({
        contexts: {
          ...state.contexts,
          [field]: value
        }
      }),
      () => this.validateForm()
    )
  }

  openDeal = id => {
    browserHistory.push(`/dashboard/deals/${id}`)
  }

  changeEnderType = enderType => {
    this.setState({ enderType }, () => this.validateForm())
  }

  /**
   * handles deal status change
   */
  changeDealStatus = status => {
    this.setState({ dealStatus: status }, () => this.validateForm())
  }

  validateForm = () => {
    const validationErrors = []

    _.each(this.Validators, (validate, name) => {
      if (validate() === false) {
        validationErrors.push(name)
      }
    })

    this.setState({
      validationErrors
    })

    return validationErrors.length === 0
  }

  getAllRoles = () => {
    const { enderType, clients, agents, escrowOfficers, referrals } = this.state
    const roles = []

    _.each(clients, client => roles.push(_.omit(client, 'id')))
    _.each(agents, agent => roles.push(_.omit(agent, 'id')))
    _.each(escrowOfficers, co => roles.push(_.omit(co, 'id')))

    if (enderType === 'AgentDoubleEnder') {
      _.each(referrals, referral => roles.push(_.omit(referral, 'id')))
    }

    return roles.filter(role => role.isEditable !== false)
  }

  getBuyerNames = () => {
    const { clients } = this.state

    return _.chain(clients)
      .pick(client => !client.readOnly)
      .map(client => getLegalFullName(client, false))
      .join(', ')
      .value()
  }

  createOffer = async () => {
    this.isFormSubmitted = true

    if (!this.validateForm(true)) {
      return false
    }

    const { deal } = this.props
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
      const checklist = await this.props.createOffer(
        deal.id,
        buyerName,
        order,
        isBackupOffer,
        deal.property_type
      )

      if (isPrimaryOffer) {
        const roles = this.getAllRoles().map(role => ({
          ...role,
          checklist: checklist.id
        }))

        await this.props.createRoles(deal.id, roles)

        // create/update contexts
        await this.saveContexts(checklist, {
          ...contexts,
          contract_status: dealStatus,
          ender_type: enderType
        })
      }

      this.props.notify({
        title: 'Offer created',
        message: `The offer(${buyerName}) has been created`,
        status: 'success',
        dismissible: true,
        dismissAfter: 6000
      })

      return this.backToDeal()
    } catch (e) {
      this.props.notify({
        title: 'Could not create offer',
        message: e.response && e.response.body ? e.response.body.message : null,
        status: 'error',
        dismissible: true
      })
    }

    this.setState({ saving: false })
  }

  saveContexts = async (checklist, contexts) => {
    const list = []

    _.each(contexts, (value, key) => {
      if (
        _.isUndefined(value) ||
        value === null ||
        (typeof value === 'string' && value.length === 0)
      ) {
        return false
      }

      const field = Deal.get.context(this.props.deal, key)

      list.push({
        value,
        definition: DealContext.getDefinitionId(this.props.deal.id, key),
        checklist: checklist.id,
        approved: field ? field.needs_approval : false
      })
    })

    return this.props.upsertContexts(this.props.deal.id, list)
  }

  getMaxOrder = () => {
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

  isBackupOffer = () => this.state.offerType === 'backup'

  isPrimaryOffer = () => this.state.offerType === 'primary'

  isLeaseDeal = () => {
    const { deal } = this.props

    return deal.property_type.includes('Lease')
  }

  getDealContexts = () => {
    const { deal } = this.props

    return DealContext.getItems(
      this.props.deal.id,
      'Buying',
      deal.property_type,
      true
    )
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
      cancelLabel: 'No, dont cancel',
      onConfirm: this.backToDeal
    })
  }

  /**
   * check an specific field has error or not
   */
  hasError = field => {
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

  get RequiredFields() {
    return _.keys(this.Validators)
  }

  /**
   * returns list of validators
   */
  get Validators() {
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
      return {
        buyer_name: () => buyerName.length > 0
      }
    }

    return {
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
          deal.id,
          contexts,
          'Buying',
          deal.property_type,
          DealContext.getHasActiveOffer(deal)
        )
    }
  }

  loadStatuses = async () => {
    try {
      const statuses = await getDealStatuses(this.props.deal.brand.id)

      this.setState({
        statuses
      })
    } catch (e) {
      console.log(e)
    }
  }

  get StatusList() {
    return this.state.statuses
      .filter(
        status =>
          status.is_pending &&
          status.deal_types.includes('Buying') &&
          status.property_types.includes(this.props.deal.property_type)
      )
      .map(status => status.label)
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
      // dealHasPrimaryOffer,
      validationErrors
    } = this.state
    const { deal } = this.props

    const dealContexts = this.getDealContexts()
    const isDoubleEndedAgent = enderType === 'AgentDoubleEnder'
    const requiredFields = this.RequiredFields

    if (this.state.dealHasPrimaryOffer) {
      return false
    }

    return (
      <div className="deal-create-offer">
        <Helmet>
          <title>Add Offer | Deals | Rechat</title>
        </Helmet>

        <FullPageHeader
          title="Add New Offer"
          handleClose={this.cancelCreateOffer}
        />

        <div className="form">
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
                isRequired={requiredFields.includes('clients')}
                hasError={this.hasError('clients')}
                dealSide="Buying"
                clients={clients}
                onUpsertClient={form => this.onUpsertRole(form, 'clients')}
                onRemoveClient={id => this.onRemoveRole(id, 'clients')}
              />

              <EnderType
                isRequired={requiredFields.includes('ender_type')}
                hasError={this.hasError('ender_type')}
                enderType={enderType}
                showAgentDoubleEnder
                onChangeEnderType={type => this.changeEnderType(type)}
              />

              <DealAgents
                isRequired={requiredFields.includes('agents')}
                hasError={this.hasError('agents')}
                scenario="CreateOffer"
                showDealSideAs="Buying"
                dealSide={deal.deal_type}
                dealEnderType={enderType}
                isCommissionRequired={this.IsDoubleEnded}
                agents={agents}
                onUpsertAgent={form => this.onUpsertRole(form, 'agents')}
                onRemoveAgent={id => this.onRemoveRole(id, 'agents')}
              />

              {!this.isLeaseDeal() && (
                <EscrowOfficers
                  isRequired={requiredFields.includes('escrow_officers')}
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
                isRequired={requiredFields.includes('deal_status')}
                hasError={this.hasError('deal_status')}
                statuses={this.StatusList}
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
                areContextsRequired={requiredFields.includes('contexts')}
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
          {!saving && submitError && (
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
                render={({ activeIntercom, isIntercomActive }) => (
                  <Button
                    color="secondary"
                    onClick={!isIntercomActive ? activeIntercom : () => false}
                  >
                    Support
                  </Button>
                )}
              />
            </div>
          )}

          <Button
            color="secondary"
            variant="contained"
            disabled={saving || offerType.length === 0}
            onClick={this.createOffer}
          >
            {saving ? 'Creating Offer ...' : 'Create Offer'}
          </Button>

          <div className="error-summary">
            {this.isFormSubmitted && validationErrors.length > 0 && (
              <span>
                {validationErrors.length} required fields remaining to complete.
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
    upsertContexts,
    notify,
    confirmation
  }
)(CreateOffer)
