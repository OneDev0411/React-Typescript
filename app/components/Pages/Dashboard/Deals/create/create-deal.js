// todo: reimplement from scratch

import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { browserHistory } from 'react-router'
import _ from 'underscore'
import moment from 'moment'
import { Helmet } from 'react-helmet'

import { Button } from '@material-ui/core'

import { getActiveTeamId } from 'utils/user-teams'

import Deal from 'models/Deal'

import DealContext from 'models/Deal/helpers/dynamic-context'

import { FullPageHeader } from 'components/FullPageHeader'

import { confirmation } from 'actions/confirmation'

import { hasUserAccessToDeals } from 'utils/user-teams'

import {
  createDeal,
  upsertContexts,
  ejectDraftMode,
  updateListing,
  createRoles
} from 'actions/deals'

import { isBackOffice } from 'utils/user-teams'

import { getBrandStatuses } from 'models/Deal/status/get-brand-statuses'

import DealType from './deal-type'
import DealSide from './deal-side'
import DealPropertyType from './deal-property-type'
import DealClients from './deal-clients'
import DealAgents from './deal-agents'
import DealStatus from './deal-status'
import DealAddress from './deal-address'
import EscrowOfficers from './escrow-officer'
import Contexts from './contexts'
import EnderType from './deal-ender-type'
import Alert from '../../Partials/Alert'
import OpenDeal from '../utils/open-deal'

class CreateDeal extends React.Component {
  state = {
    saving: false,
    isDraft: -1,
    dealSide: '',
    dealPropertyType: '',
    defaultDealAddress: null,
    dealAddress: null,
    dealStatus: '',
    enderType: undefined,
    contexts: {},
    agents: {},
    sellingAgents: {},
    clients: {},
    sellingClients: {},
    referrals: {},
    escrowOfficers: {},
    submitError: null,
    validationErrors: [],
    statuses: []
  }

  componentDidMount() {
    if (!hasUserAccessToDeals(this.props.user)) {
      return browserHistory.push('/dashboard/mls')
    }

    if (this.props.params.id) {
      this.initializeDeal()
    }

    this.loadStatuses()
  }

  isFormSubmitted = false

  initializeDeal = async () => {
    const { deal } = this.props

    if (!deal.checklists) {
      return browserHistory.push(`/dashboard/deals/${deal.id}`)
    }

    const enderType = Deal.get.field(deal, 'ender_type')

    const dealAddress = this.generateAddressFromDeal(deal)

    this.setState({
      isDraft: false,
      dealSide: deal.deal_type,
      dealPropertyType: deal.property_type,
      enderType,
      dealStatus: Deal.get.status(deal) || '',
      contexts: this.generateContextsFromDeal(deal),
      defaultDealAddress: dealAddress,
      dealAddress,
      ...this.generateRolesFromDeal(deal)
    })
  }

  generateRolesFromDeal = deal => {
    const isBuyingDeal = deal.deal_type === 'Buying'

    const roles = {
      agents: {},
      sellingAgents: {},
      clients: {},
      sellingClients: {},
      referrals: {},
      escrowOfficers: {}
    }

    if (!deal.roles) {
      return roles
    }

    deal.roles.forEach(roleId => {
      const roleItem = this.props.roles[roleId]

      if (!roleItem) {
        return false
      }

      const { id, role: roleName } = roleItem

      // dont allow to modify users
      const user = {
        ...roleItem,
        isEditable: false,
        isRemovable: false
      }

      if (roleName.includes('Referral')) {
        roles.referrals = {
          ...roles.referrals,
          [id]: user
        }
      }

      if (roleName === 'Title') {
        roles.escrowOfficers = {
          ...roles.escrowOfficers,
          [id]: user
        }
      }

      if (['SellerAgent', 'CoSellerAgent'].includes(roleName)) {
        if (isBuyingDeal) {
          roles.sellingAgents = {
            ...roles.sellingAgents,
            [id]: user
          }
        } else {
          roles.agents = {
            ...roles.agents,
            [id]: user
          }
        }
      }

      if (
        [
          'Seller',
          'SellerPowerOfAttorney',
          'Landlord',
          'LandlordPowerOfAttorney'
        ].includes(roleName)
      ) {
        if (isBuyingDeal) {
          roles.sellingClients = {
            ...roles.sellingClients,
            [id]: user
          }
        } else {
          roles.clients = {
            ...roles.clients,
            [id]: user
          }
        }
      }

      if (['BuyerAgent', 'CoBuyerAgent'].includes(roleName)) {
        roles.agents = {
          ...roles.agents,
          [id]: user
        }
      }

      if (
        [
          'Buyer',
          'BuyerPowerOfAttorney',
          'Tenant',
          'TenantPowerOfAttorney'
        ].includes(roleName)
      ) {
        roles.clients = {
          ...roles.clients,
          [id]: user
        }
      }
    })

    return roles
  }

  generateContextsFromDeal = deal => {
    const contexts = {}

    const dealContexts = _.indexBy(
      this.getDealContexts(deal.deal_type, deal.property_type),
      'key'
    )

    _.each(dealContexts, context => {
      let value = Deal.get.field(deal, context.key)

      if (value !== null && context.data_type === 'Date') {
        value = moment.utc(value * 1000).format()
      }

      contexts[context.key] = value !== null ? value : ''
    })

    return contexts
  }

  generateAddressFromDeal = deal => {
    const address_components = {}

    const fields = [
      'city',
      'postal_code',
      'state',
      'state_code',
      'street_dir_prefix',
      'street_name',
      'street_number',
      'street_suffix',
      'unit_number'
    ]

    fields.forEach(name => {
      address_components[name] = Deal.get.field(deal, name)
    })

    if (_.every(address_components, component => component === null)) {
      return null
    }

    return {
      id: deal.listing,
      address_components,
      image: Deal.get.field(deal, 'photo'),
      type: 'listing'
    }
  }

  /**
   * handle Update or Insert a role
   * roles: agent, sellingAgent, client, sellingClient, referrals, escrowOfficers
   */
  onUpsertRole = (form, type) =>
    this.setState(
      state => ({
        [type]: {
          ...state[type],
          [form.id]: form
        }
      }),
      () => this.validateForm()
    )

  /**
   * handles remove a role
   */
  onRemoveRole = (id, type) =>
    this.setState(
      state => ({
        [type]: _.omit(state[type], role => role.id === id)
      }),
      () => this.validateForm()
    )

  /**
   * handles create an mls or manual address
   */
  onCreateAddress = address => {
    this.setState({ dealAddress: address }, () => this.validateForm())
  }

  /**
   * validate form
   */
  validateForm = () => {
    const validationErrors = []

    _.each(this.Validators, (item, name) => {
      if (item.validator() === true) {
        return true
      }

      validationErrors.push(name)
    })

    this.setState({
      validationErrors
    })

    return validationErrors.length === 0
  }

  get RequiredFields() {
    return _.keys(this.Validators)
  }

  get ContextsListId() {
    if (this.props.deal) {
      return this.props.deal.id
    }

    return getActiveTeamId(this.props.user)
  }

  loadStatuses = async () => {
    try {
      const statuses = await getBrandStatuses(getActiveTeamId(this.props.user))

      this.setState({
        statuses
      })
    } catch (e) {
      console.log(e)
    }
  }

  get StatusList() {
    return this.state.statuses
      .filter(status => {
        if (this.state.dealSide === 'Selling' && !status.is_active) {
          return false
        }

        if (this.state.dealSide === 'Buying' && !status.is_pending) {
          return false
        }

        return (
          status.deal_types.includes(this.state.dealSide) &&
          status.property_types.includes(this.state.dealPropertyType)
        )
      })
      .map(status => status.label)
  }

  /**
   * returns list of validators
   */
  get Validators() {
    const {
      isDraft,
      dealSide,
      dealPropertyType,
      dealAddress,
      contexts,
      dealStatus,
      agents,
      sellingAgents,
      clients,
      sellingClients,
      escrowOfficers
    } = this.state

    const validations = {
      side: {
        validator: () => dealSide.length > 0
      },
      property_type: {
        validator: () => dealPropertyType.length > 0
      },
      status: {
        validator: () =>
          this.StatusList.length === 0 || this.StatusList.includes(dealStatus)
      },
      address: {
        validator: () => dealAddress !== null
      },
      selling_agents: {
        // on Buying side, user should add SellerAgent
        validator: () =>
          dealSide === 'Buying' ? _.size(sellingAgents) > 0 : true
      },
      selling_clients: {
        // on Buying side, user should add SellerClient
        validator: () =>
          dealSide === 'Buying' ? _.size(sellingClients) > 0 : true
      },
      escrow_officer: {
        validator: () => {
          if (dealPropertyType && dealPropertyType.includes('Lease')) {
            return true
          }

          return dealSide === 'Buying' ? _.size(escrowOfficers) > 0 : true
        }
      },
      agents: {
        validator: () =>
          dealSide === 'Buying'
            ? !!_.find(agents, agent => agent.role === 'BuyerAgent')
            : !!_.find(agents, agent => agent.role === 'SellerAgent')
      },
      clients: {
        validator: () => _.size(clients) > 0
      },
      contexts: {
        validator: () =>
          DealContext.validateList(
            this.ContextsListId,
            contexts,
            dealSide,
            dealPropertyType
          )
      }
    }

    // only Side and PropertyType are required when deal type is Draft
    if (isDraft) {
      return {
        side: validations.side,
        property_type: validations.property_type,
        clients: validations.clients,
        agents: validations.agents
      }
    }

    return validations
  }

  onClosePage = () => {
    const { deal } = this.props

    this.props.confirmation({
      message: deal ? 'Dont want to go live?' : 'Cancel deal creation?',
      description: deal
        ? 'By canceling you will lose your deal updates'
        : 'By canceling you will lose your work.',
      confirmLabel: 'Yes, cancel',
      cancelLabel: 'No, dont cancel',
      onConfirm: () =>
        browserHistory.push(`/dashboard/deals/${deal ? deal.id : ''}`)
    })
  }

  /**
   * when user tries to change deal side, we should show a confirmation modal
   */
  requestChangeDealSide = nextDealSide => {
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
   * handles change deal type
   */
  changeDealType = isDraft =>
    this.setState({
      isDraft,
      validationErrors: [],
      submitError: null
    })

  /**
   * handles changing deal side
   * when deal side changes, we should reset roles and ender_type
   */
  changeDealSide = dealSide =>
    this.setState(
      state => ({
        dealSide,
        dealStatus: '',
        agents: {},
        clients: {},
        referrals: {},
        sellingClients: {},
        sellingAgents: {},
        escrowOfficers: {},
        enderType: undefined,
        contexts: this.getDefaultContextValues(dealSide, state.dealPropertyType)
      }),
      () => this.validateForm()
    )

  /**
   * handles change deal property type
   */
  changePropertyType = dealPropertyType =>
    this.setState(state => ({
      dealPropertyType,
      dealStatus: '',
      contexts: this.getDefaultContextValues(state.dealSide, dealPropertyType),
      escrowOfficers: {}
    }))

  /**
   * handles deal status change
   */
  changeDealStatus = status =>
    this.setState({ dealStatus: status }, () => this.validateForm())

  /**
   * handles deal contexts change
   */
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

  /**
   * handles deal ender_type context change
   */
  changeEnderType = enderType => this.setState({ enderType })

  /**
   * check an specific field has error or not
   */
  hasError = field => {
    const { validationErrors } = this.state

    return this.isFormSubmitted && validationErrors.includes(field)
  }

  /**
   * updates or create a new deal
   */
  updateOrCreateDeal = () => {
    this.setState(
      state => ({
        isDraft: this.props.deal ? true : state.isDraft
      }),
      this.upsertDeal
    )
  }

  /**
   * updates a deal and ejects draft mode
   */
  goLive = () => {
    this.setState(
      {
        isDraft: false
      },
      this.upsertDeal
    )
  }

  /**
   * upserts a deal
   */
  upsertDeal = async () => {
    this.isFormSubmitted = true

    if (!this.validateForm(true)) {
      return false
    }

    const { isDraft } = this.state
    const { user } = this.props

    // deal is created before
    if (this.props.deal) {
      return this.updateDeal()
    }

    // show loading
    this.setState({ saving: true })

    const dealObject = {
      ...this.createDealObject(),
      brand: this.getPrimaryAgentBrandId(),
      is_draft: isDraft
    }

    try {
      // create deal
      const deal = await Deal.create(user, dealObject)
      const checklist = await Deal.createChecklist(deal.id, {
        conditions: {
          deal_type: this.state.dealSide,
          property_type: this.state.dealPropertyType
        }
      })

      const roles = this.Roles.map(role => ({
        ...role,
        checklist: checklist.id
      }))

      await Deal.createRole(deal.id, roles)

      const contexts = this.Contexts.map(context => ({
        ...context,
        checklist: checklist.id
      }))

      await this.props.upsertContexts(deal.id, contexts)

      // dispatch new deal
      await this.props.createDeal(deal)

      this.setState({ saving: false })

      return OpenDeal(deal.id)
    } catch (e) {
      console.log(e)
      this.setState({
        saving: false,
        submitError: true
      })
    }
  }

  /**
   * updates deal
   */
  updateDeal = async () => {
    const { id: dealId } = this.props.deal

    const dealObject = this.createDealObject()
    const contexts = this.Contexts.map(context => ({
      ...context,
      checklist: DealContext.getChecklist(this.props.deal, context.key)
    }))

    const newRoles = _.filter(this.Roles, role => !role.deal).map(role => ({
      ...role,
      checklist: this.props.deal.checklists[0]
    }))

    this.setState({ saving: true })

    try {
      // update listing if provided
      if (dealObject.listing) {
        await this.props.updateListing(dealId, dealObject.listing)
      }

      // create/update contexts
      await this.props.upsertContexts(dealId, contexts)

      if (this.state.isDraft === false) {
        await this.props.ejectDraftMode(dealId)
      }

      if (newRoles.length > 0) {
        await this.props.createRoles(dealId, newRoles)
      }

      return OpenDeal(dealId)
    } catch (e) {
      console.log(e)
      this.setState({
        saving: false,
        submitError: true
      })
    }
  }

  /**
   * create the deal object
   */
  createDealObject = () => {
    const dealObject = {
      property_type: this.state.dealPropertyType,
      deal_type: this.state.dealSide
    }

    if (this.state.dealAddress && this.state.dealAddress.id) {
      dealObject.listing = this.state.dealAddress.id
    }

    return dealObject
  }

  getDealStatus = () => {
    if (this.state.dealSide === 'Buying') {
      return {
        contract_status: this.state.dealStatus
      }
    }

    const defaultListingStatus = this.state.dealPropertyType.includes('Lease')
      ? 'Lease'
      : 'Active'

    return {
      listing_status: this.state.dealStatus || defaultListingStatus
    }
  }

  getPrimaryAgentBrandId = () => {
    const primaryAgent = Object.values(this.state.agents).find(agent =>
      ['SellerAgent', 'BuyerAgent'].includes(agent.role)
    )

    return primaryAgent.brand
  }

  /**
   * create context object
   */
  createContextsObject = contexts => {
    const { dealSide, dealPropertyType } = this.state
    const list = []

    const dealContexts = _.indexBy(
      this.getDealContexts(dealSide, dealPropertyType),
      'key'
    )

    _.each(contexts, (value, key) => {
      if (
        _.isUndefined(value) ||
        (value === null && key !== 'ender_type') ||
        (typeof value === 'string' && value.length === 0)
      ) {
        return false
      }

      const needsApproval = dealContexts[key]
        ? dealContexts[key].needs_approval
        : false

      const approved = this.props.isBackOffice ? true : !needsApproval

      list.push({
        key,
        approved,
        value,
        definition: DealContext.getDefinitionId(this.ContextsListId, key)
      })
    })

    return list
  }

  /**
   * get context for deal side (Buying or Selling)
   */
  getDealContexts = (dealSide, dealPropertyType) => {
    if (dealSide.length === 0 || dealPropertyType.length === 0) {
      return []
    }

    return DealContext.getItems(
      this.ContextsListId,
      dealSide,
      dealPropertyType
    ).filter(field => field.mandatory)
  }

  /**
   * get default context values
   */
  getDefaultContextValues = (dealSide, dealPropertyType) => {
    const list = this.getDealContexts(dealSide, dealPropertyType)
    const defaultValues = {}

    list.forEach(context => {
      if (!_.isUndefined(context.default_value)) {
        defaultValues[context.key] = context.default_value
      }
    })

    return defaultValues
  }

  /**
   * check commission is required or not
   */
  get IsDoubleEnded() {
    return ['AgentDoubleEnder', 'OfficeDoubleEnder'].includes(
      this.state.enderType
    )
  }

  /**
   * get submit button label
   */
  get SubmitLabel() {
    const { deal } = this.props
    const { saving } = this.state

    if (!deal) {
      return saving ? 'Creating ...' : 'Create Deal'
    }

    return saving ? 'Updating Deal ...' : 'Save Updates'
  }

  get Contexts() {
    let contexts = {
      ...this.state.contexts,
      ...this.getDealStatus()
    }

    if (this.state.enderType !== undefined) {
      contexts.ender_type = this.state.enderType
    }

    if (this.state.dealAddress && !this.state.dealAddress.id) {
      contexts = {
        ...contexts,
        ...this.state.dealAddress.address_components
      }
    }

    return this.createContextsObject(contexts)
  }

  /**
   * flatten all entered roles
   */
  get Roles() {
    const {
      agents,
      clients,
      sellingAgents,
      sellingClients,
      referrals,
      escrowOfficers
    } = this.state

    const roles = []

    _.each(clients, client => roles.push(_.omit(client, ['id', 'contact'])))
    _.each(sellingClients, client =>
      roles.push(_.omit(client, ['id', 'contact']))
    )

    _.each(agents, agent => roles.push(_.omit(agent, ['id', 'contact'])))
    _.each(sellingAgents, agent => roles.push(_.omit(agent, ['id', 'contact'])))

    _.each(referrals, referral =>
      roles.push(_.omit(referral, ['id', 'contact']))
    )
    _.each(escrowOfficers, officer =>
      roles.push(_.omit(officer, ['id', 'contact']))
    )

    return roles
  }

  render() {
    const { deal } = this.props

    const {
      saving,
      isDraft,
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
      submitError,
      validationErrors
    } = this.state

    const dealContexts = this.getDealContexts(dealSide, dealPropertyType)
    const requiredFields = this.RequiredFields
    const isLeaseDeal = dealPropertyType && dealPropertyType.includes('Lease')
    const canSaveDeal =
      !saving &&
      isDraft !== -1 &&
      dealSide.length > 0 &&
      dealPropertyType.length > 0

    return (
      <div className="deal-create">
        <Helmet>
          <title>Create New Deal | Deals | Rechat</title>
        </Helmet>
        <FullPageHeader
          title={
            deal ? 'Update deal information to Go Live' : 'Create New Deal'
          }
          handleClose={this.onClosePage}
        />
        <div className="form">
          {!deal && (
            <div className="swoosh">Swoosh! Another one in the bag.</div>
          )}

          {!deal && (
            <Fragment>
              <DealType
                isDraft={isDraft}
                isRequired
                onChangeDealType={this.changeDealType}
              />

              <DealSide
                selectedSide={dealSide}
                onChangeDealSide={this.requestChangeDealSide}
              />

              <DealPropertyType
                selectedType={dealPropertyType}
                onChangeDealType={this.changePropertyType}
              />
            </Fragment>
          )}

          {isDraft !== -1 &&
            dealSide.length > 0 &&
            dealPropertyType.length > 0 && (
              <div>
                <DealClients
                  isRequired={requiredFields.includes('clients')}
                  hasError={this.hasError('clients')}
                  dealSide={dealSide}
                  clients={clients}
                  onUpsertClient={form => this.onUpsertRole(form, 'clients')}
                  onRemoveClient={id => this.onRemoveRole(id, 'clients')}
                />

                <DealAgents
                  isRequired={requiredFields.includes('agents')}
                  hasError={this.hasError('agents')}
                  scenario="CreateDeal"
                  dealSide={dealSide}
                  agents={agents}
                  dealEnderType={enderType}
                  onUpsertAgent={form => this.onUpsertRole(form, 'agents')}
                  onRemoveAgent={id => this.onRemoveRole(id, 'agents')}
                />

                {dealSide === 'Buying' && (
                  <Fragment>
                    <EnderType
                      isRequired={false}
                      enderType={enderType}
                      showAgentDoubleEnder
                      onChangeEnderType={this.changeEnderType}
                    />

                    <DealAgents
                      isRequired={requiredFields.includes('selling_agents')}
                      isBackOffice={this.props.isBackOffice}
                      hasError={this.hasError('selling_agents')}
                      scenario="CreateDeal"
                      dealSide={dealSide}
                      showDealSideAs="Selling"
                      agents={sellingAgents}
                      isCommissionRequired={this.IsDoubleEnded}
                      dealEnderType={enderType}
                      onUpsertAgent={form =>
                        this.onUpsertRole(form, 'sellingAgents')
                      }
                      onRemoveAgent={id =>
                        this.onRemoveRole(id, 'sellingAgents')
                      }
                    />

                    <DealClients
                      isRequired={requiredFields.includes('selling_clients')}
                      hasError={this.hasError('selling_clients')}
                      dealSide="Selling"
                      clients={sellingClients}
                      title="Seller (Landlord)"
                      onUpsertClient={form =>
                        this.onUpsertRole(form, 'sellingClients')
                      }
                      onRemoveClient={id =>
                        this.onRemoveRole(id, 'sellingClients')
                      }
                    />

                    {!isLeaseDeal && (
                      <EscrowOfficers
                        isRequired={requiredFields.includes('escrow_officer')}
                        hasError={this.hasError('escrow_officer')}
                        escrowOfficers={escrowOfficers}
                        onUpsertEscrowOfficer={form =>
                          this.onUpsertRole(form, 'escrowOfficers')
                        }
                        onRemoveEscrowOfficer={id =>
                          this.onRemoveRole(id, 'escrowOfficers')
                        }
                      />
                    )}
                  </Fragment>
                )}

                {!isDraft && (
                  <DealStatus
                    isRequired={requiredFields.includes('status')}
                    hasError={this.hasError('status')}
                    dealStatus={dealStatus}
                    statuses={this.StatusList}
                    onChangeDealStatus={this.changeDealStatus}
                  />
                )}

                <DealAddress
                  isRequired={requiredFields.includes('address')}
                  hasError={this.hasError('address')}
                  dealAddress={dealAddress}
                  defaultDealAddress={this.state.defaultDealAddress}
                  dealSide={dealSide}
                  onCreateAddress={this.onCreateAddress}
                  onRemoveAddress={() => this.setState({ dealAddress: null })}
                />

                {dealContexts.length > 0 &&
                  requiredFields.includes('contexts') && (
                    <Contexts
                      areContextsRequired={requiredFields.includes('contexts')}
                      hasError={this.hasError('contexts')}
                      contexts={contexts}
                      onChangeContext={(field, value) =>
                        this.changeContext(field, value)
                      }
                      fields={dealContexts}
                    />
                  )}
              </div>
            )}
        </div>

        <div className="actions">
          {!saving && submitError && (
            <Alert
              code={500}
              type="error"
              style={{ float: 'left', marginBottom: '2rem' }}
            />
          )}

          <Button
            color="secondary"
            variant="outlined"
            style={{ marginRight: '10px' }}
            onClick={this.updateOrCreateDeal}
            disabled={!canSaveDeal}
          >
            {this.SubmitLabel}
          </Button>

          {deal && (
            <Button
              color="secondary"
              variant="outlined"
              onClick={this.goLive}
              disabled={!canSaveDeal}
            >
              {saving ? 'Saving ...' : 'Make visible to admin'}
            </Button>
          )}

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

function mapStateToProps({ user, deals }, { params }) {
  return {
    user,
    confirmation,
    deal: params.id && deals.list && deals.list[params.id],
    roles: params.id && deals.roles,
    isBackOffice: isBackOffice(user)
  }
}

export default connect(mapStateToProps, {
  confirmation,
  createDeal,
  upsertContexts,
  ejectDraftMode,
  createRoles,
  updateListing,
  notify
})(CreateDeal)
