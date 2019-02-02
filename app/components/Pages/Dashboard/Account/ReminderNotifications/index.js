import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import Fetch from 'services/fetch'
import { getContexts } from 'actions/deals'
import { getAttributeDefs } from 'store_actions/contacts'
import { getActiveTeamId } from 'utils/user-teams'
import { selectDefsBySection } from 'reducers/contacts/attributeDefs'
import PageHeader from 'components/PageHeader'

import Column from './column'

const API_URL = '/calendar/settings/notifications'
const DROPDOWN_OPTIONS = [
  {
    label: '1 Day Before',
    value: 86400
  },
  {
    label: '2 days before',
    value: 172800
  },
  {
    label: '3 days before',
    value: 259200
  },
  {
    label: '4 days before',
    value: 345600
  },
  {
    label: '5 days before',
    value: 432000
  },
  {
    label: '6 days before',
    value: 518400
  },
  {
    label: '1 week before',
    value: 604800
  },
  {
    label: '2 weeks before',
    value: 1209600
  }
]

class ReminderNotifications extends Component {
  state = {
    columns: [],
    settings: []
  }

  async componentDidMount() {
    const settings = await this.getSettings()

    const columns = [
      {
        title: 'Deals Critical Dates',
        items: await this.getDealsColumnData()
      },
      {
        title: 'Contact Dates',
        items: this.getContactsColumnData()
      }
    ]

    this.setState({ columns, settings })
  }

  async getDealsColumnData() {
    const brandId = getActiveTeamId(this.props.user)

    if (!this.props.dealsContexts[brandId]) {
      await this.props.getContexts(brandId)
    }

    const dealsContexts = this.props.dealsContexts[brandId]
      ? this.props.dealsContexts[brandId].filter(
          context => context.data_type === 'Date'
        )
      : []

    return dealsContexts.map(ctx => ({
      label: ctx.label,
      name: ctx.key,
      type: 'deal_context'
    }))
  }

  getContactsColumnData() {
    const { contactsAttributeDefs } = this.props

    return selectDefsBySection(contactsAttributeDefs, 'Dates').map(def => ({
      label: def.label,
      name: def.name || def.label,
      type: 'contact_attribute'
    }))
  }

  async getSettings() {
    const response = await new Fetch().get(API_URL)

    return response.body.data.map(({ object_type, event_type, reminder }) => ({
      object_type,
      event_type,
      reminder
    }))
  }

  async setSettings(settings) {
    return new Fetch().put(API_URL).send({ settings })
  }

  filterSetting = (currentSetting, setting) =>
    !(
      currentSetting.object_type === setting.object_type &&
      currentSetting.event_type === setting.event_type
    )

  removeSetting = setting => {
    this.setState(
      prevState => ({
        ...prevState,
        settings: prevState.settings.filter(item =>
          this.filterSetting(item, setting)
        )
      }),
      async () => this.setSettings(this.state.settings)
    )
  }

  addSetting = setting => {
    this.setState(
      prevState => ({
        ...prevState,
        settings: [
          ...prevState.settings.filter(item =>
            this.filterSetting(item, setting)
          ),
          setting
        ]
      }),
      async () => this.setSettings(this.state.settings)
    )
  }

  changeHandler = ({ type, setting }) => {
    if (type === 'add') {
      this.addSetting(setting)

      return
    }

    this.removeSetting(setting)
  }

  render() {
    return (
      <Fragment>
        <PageHeader style={{ marginBottom: '1.5em', marginTop: '1.5rem' }}>
          <PageHeader.Title showBackButton={false}>
            <PageHeader.Heading>Reminder Notifications</PageHeader.Heading>
          </PageHeader.Title>
        </PageHeader>
        <Flex>
          {this.state.columns.map((col, index) => (
            <Column
              key={index}
              {...col}
              settings={this.state.settings}
              options={DROPDOWN_OPTIONS}
              onChange={this.changeHandler}
            />
          ))}
        </Flex>
      </Fragment>
    )
  }
}

export default connect(
  ({ user, deals, contacts }) => ({
    user,
    dealsContexts: deals.contexts,
    contactsAttributeDefs: contacts.attributeDefs
  }),
  {
    getContexts,
    getAttributeDefs
  }
)(ReminderNotifications)
