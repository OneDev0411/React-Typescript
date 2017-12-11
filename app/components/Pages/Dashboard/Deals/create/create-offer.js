import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { browserHistory } from 'react-router'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import cn from 'classnames'
import Deal from '../../../../../models/Deal'
import Navbar from './nav'
import OfferType from './offer-type'
import EnderType from './offer-ender-type'
import DealClients from './deal-clients'
import DealAgents from './deal-agents'
import ClosingOfficers from './offer-closing-officer'
import DealReferrals from './deal-referrals'
import CriticalDates from './critical-dates'
import { createRoles, createOffer, updateContext } from '../../../../../store_actions/deals'

class CreateOffer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      saving: false,
      offerType: '',
      enderType: -1,
      criticalDates: {},
      agents: {},
      clients: {},
      closingOfficers: {},
      referrals: {}
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

  changeCriticalDates(field, value) {
    this.setState({
      criticalDates: {
        ...this.state.criticalDates,
        [field]: value
      }
    })
  }

  getRoles() {
    const { enderType, agents, clients, closingOfficers, referrals } = this.state
    const roles = []
    _.each(clients, client => roles.push(client))
    _.each(agents, agent => roles.push(agent))
    _.each(closingOfficers, co => roles.push(co))

    if (enderType === 'AgentDoubleEnder') {
      _.each(referrals, referral => roles.push(referral))
    }

    return roles
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

  isFormValidated() {
    const { offerType, clients, agents, enderType } = this.state

    return offerType.length > 0 &&
      enderType !== -1 &&
      _.size(agents) > 0 &&
      _.size(clients) > 0
  }

  async createOffer() {
    const { deal, notify, createOffer, createRoles, updateContext } = this.props
    const { offerType, clients, enderType, criticalDates } = this.state
    const isBackup = offerType === 'backup'
    const order = this.getMaxOrder() + 1
    const buyerName = _.map(clients, client =>
      `${client.legal_first_name} ${client.legal_last_name}`).join(', ')

    this.setState({ saving: true })

    try {
      await createOffer(deal.id, buyerName, order, isBackup, deal.property_type)
      await createRoles(deal.id, this.getRoles())
      // create/update contexts
      await updateContext(deal.id, {
        ...criticalDates,
        ender_type: enderType
      }, true)

      notify({
        title: 'Offer created',
        message: `The offer(${buyerName}) has been created`,
        status: 'success',
        dismissible: true,
        dismissAfter: 6000
      })

      this.backToDeal()
    } catch(e) {
      notify({
        title: 'Could not create offer',
        message: e.response && e.response.body ? e.response.body.message : null,
        status: 'error',
        dismissible: true
      })
    }

    this.setState({ saving: false })
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

  backToDeal() {
    const { deal } = this.props
    browserHistory.push(`/dashboard/deals/${deal.id}`)
  }

  render() {
    const { saving, criticalDates, referrals, closingOfficers, offerType,
      enderType, agents, clients } = this.state
    const { deal } = this.props

    const canCreateOffer = this.isFormValidated() && !saving

    return (
      <div className="deal-create-offer">
        <Navbar
          title="Add New Offer"
          onClose={() => this.backToDeal()}
        />

        <div className="form">

          <OfferType
            offerType={offerType}
            deal={deal}
            onChangeOfferType={offer => this.changeOfferType(offer)}
          />

          <DealClients
            dealSide={deal.deal_type}
            clients={clients}
            onUpsertClient={form => this.onUpsertRole(form, 'clients')}
            onRemoveClient={id => this.onRemoveRole(id, 'clients')}
          />

          <EnderType
            enderType={enderType}
            onChangeEnderType={type => this.changeEnderType(type)}
          />

          <DealAgents
            dealSide={deal.deal_type}
            agents={agents}
            onUpsertAgent={form => this.onUpsertRole(form, 'agents')}
            onRemoveAgent={id => this.onRemoveRole(id, 'agents')}
          />

          <ClosingOfficers
            closingOfficers={closingOfficers}
            onUpsertClosingOfficer={form => this.onUpsertRole(form, 'closingOfficers')}
            onRemoveClosingOfficer={id => this.onRemoveRole(id, 'closingOfficers')}
          />

          {
            enderType === 'AgentDoubleEnder' &&
            <DealReferrals
              dealSide={deal.deal_type}
              referrals={referrals}
              onUpsertReferral={form => this.onUpsertRole(form, 'referrals')}
              onRemoveReferral={id => this.onRemoveRole(id, 'referrals')}
            />
          }

          <CriticalDates
            criticalDates={criticalDates}
            onChangeCriticalDates={(field, value) => this.changeCriticalDates(field, value)}
            fields={{
              'contract_date': 'Offer Date',
              'option_period': 'Option Date',
              'financing_due': 'Financing Due',
              'title_due': 'Title Work Due',
              't47_due': 'Survey Due',
              'closing_date': 'Closing',
              'possession_date': 'Possession'
            }}
          />

          <Button
            className={cn('btn btn-primary create-offer-button', { disabled: !canCreateOffer })}
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
    checklists: deals.checklists
  }
}

export default connect(mapStateToProps, {
  createOffer,
  createRoles,
  updateContext,
  notify
})(CreateOffer)
