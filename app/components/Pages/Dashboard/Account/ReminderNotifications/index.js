import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'
import { Helmet } from 'react-helmet'

import Fetch from 'services/fetch'
import { getContextsByBrand } from 'actions/deals'
import { getAttributeDefs } from 'store_actions/contacts'
import { getActiveTeamId } from 'utils/user-teams'
import { selectDefsBySection } from 'reducers/contacts/attributeDefs'
import ActionButton from 'components/Button/ActionButton'
import { hasUserAccessToDeals, hasUserAccessToCrm } from 'utils/user-teams'
import { selectContextsByBrand } from 'reducers/deals/contexts'

import Loading from '../../../../Partials/Loading'

import Column from './Column'

import {
  API_URL,
  CONTACT_DATE_OBJECT_TYPE,
  DEAL_DATE_OBJECT_TYPE,
  DROPDOWN_OPTIONS,
  FORCE_PUSH_API_URL,
  SHOULD_RENDER_FORCEPUSH_BUTTON
} from './constants'

const HOME_ANNIVERSARY_EVENT_TYPE = 'home_anniversary'

class ReminderNotifications extends Component {
  state = {
    columns: [],
    settings: [],
    loading: true
  }

  async componentDidMount() {
    const settings = await this.getSettings()

    const columns = []

    if (this.hasDealsAccess()) {
      const dealsColumnData = await this.getDealsColumnData()

      columns.push({
        title: 'Deals Critical Dates',
        type: DEAL_DATE_OBJECT_TYPE,
        items: dealsColumnData
      })

      const dealsRemidnersSettings = settings.filter(
        setting => setting.object_type === DEAL_DATE_OBJECT_TYPE
      )

      const shouldSelectAllDealRemidners =
        dealsColumnData.length - 1 === dealsRemidnersSettings.length &&
        dealsRemidnersSettings.every(
          setting => setting.reminder === dealsRemidnersSettings[0].reminder
        )

      if (shouldSelectAllDealRemidners) {
        settings.push({
          object_type: DEAL_DATE_OBJECT_TYPE,
          event_type: null,
          reminder: dealsRemidnersSettings[0].reminder
        })
      }
    }

    if (this.hasCrmAccess()) {
      const contactsColumnData = await this.getContactsColumnData()

      columns.push({
        title: 'Contact Dates',
        type: CONTACT_DATE_OBJECT_TYPE,
        items: contactsColumnData
      })

      const contactsRemidnersSettings = settings.filter(
        setting => setting.object_type === CONTACT_DATE_OBJECT_TYPE
      )

      const shouldSelectAllContactRemidners =
        contactsColumnData.length - 1 === contactsRemidnersSettings.length &&
        contactsRemidnersSettings.every(
          setting => setting.reminder === contactsRemidnersSettings[0].reminder
        )

      if (shouldSelectAllContactRemidners) {
        settings.push({
          object_type: CONTACT_DATE_OBJECT_TYPE,
          event_type: null,
          reminder: contactsRemidnersSettings[0].reminder
        })
      }
    }

    this.setState({ columns, settings, loading: false })
  }

  hasCrmAccess = () => hasUserAccessToCrm(this.props.user)

  hasDealsAccess = () => hasUserAccessToDeals(this.props.user)

  async getDealsColumnData() {
    const brandId = getActiveTeamId(this.props.user)

    if (!this.props.dealsContexts) {
      await this.props.getContextsByBrand(brandId)
    }

    const dealsContexts = this.props.dealsContexts
      ? this.props.dealsContexts.filter(context => context.data_type === 'Date')
      : []

    const data = dealsContexts.map(ctx => ({
      label: ctx.label,
      name: ctx.key,
      type: DEAL_DATE_OBJECT_TYPE
    }))

    return [
      {
        label: 'All',
        type: DEAL_DATE_OBJECT_TYPE,
        name: null
      },
      ...data
    ]
  }

  getContactsColumnData() {
    const { contactsAttributeDefs } = this.props

    const data = selectDefsBySection(contactsAttributeDefs, 'Dates').map(
      def => ({
        label: def.label,
        name: def.name || def.label,
        type: CONTACT_DATE_OBJECT_TYPE
      })
    )

    return [
      {
        label: 'All',
        type: CONTACT_DATE_OBJECT_TYPE,
        name: null
      },
      ...data
    ]
  }

  async getSettings() {
    const response = await new Fetch().get(API_URL)

    return response.body.data.map(({ object_type, event_type, reminder }) => {
      const setting = { object_type, event_type, reminder }

      if (setting.event_type === HOME_ANNIVERSARY_EVENT_TYPE) {
        return {
          ...setting,
          object_type: CONTACT_DATE_OBJECT_TYPE
        }
      }

      return setting
    })
  }

  async setSettings(settings) {
    const formattedSettings = settings
      .filter(setting => !!setting.event_type)
      .map(setting => {
        // I hate this part but it's forced from API side :/
        // We mostly do their dirty jobs.
        if (
          setting.object_type === CONTACT_DATE_OBJECT_TYPE &&
          setting.event_type === HOME_ANNIVERSARY_EVENT_TYPE
        ) {
          return {
            ...setting,
            object_type: null
          }
        }

        return setting
      })

    return new Fetch().put(API_URL).send({
      settings: formattedSettings
    })
  }

  filterSetting = (currentSetting, setting) =>
    !(
      currentSetting.object_type === setting.object_type &&
      currentSetting.event_type === setting.event_type
    )

  removeSetting = setting => {
    if (!setting.event_type) {
      this.setState(
        prevState => ({
          ...prevState,
          settings: prevState.settings.filter(
            item => item.object_type !== setting.object_type
          )
        }),
        async () => this.setSettings(this.state.settings)
      )

      return
    }

    this.setState(
      prevState => ({
        settings: prevState.settings.filter(item =>
          this.filterSetting(item, setting)
        )
      }),
      async () => this.setSettings(this.state.settings)
    )
  }

  addSetting = setting => {
    if (!setting.event_type) {
      this.setState(
        prevState => {
          const selectedColumn = prevState.columns.find(col =>
            col.items.some(item => item.type === setting.object_type)
          )

          const newSettings = selectedColumn.items.map(item => ({
            object_type: item.type,
            event_type: item.name,
            reminder: setting.reminder
          }))

          return {
            settings: [
              ...prevState.settings.filter(
                item => item.object_type !== setting.object_type
              ),
              ...newSettings
            ]
          }
        },
        async () => this.setSettings(this.state.settings)
      )

      return
    }

    this.setState(
      prevState => ({
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

  async forcePushNotifications() {
    return new Fetch().post(FORCE_PUSH_API_URL)
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Reminder Notifications | Settings | Rechat</title>
        </Helmet>
        <div>
          {SHOULD_RENDER_FORCEPUSH_BUTTON && (
            <ActionButton
              appearance="outline"
              style={{ marginLeft: '2rem' }}
              onClick={() => this.forcePushNotifications()}
            >
              Force Push Notifications
            </ActionButton>
          )}
        </div>
        <Flex>
          {this.state.loading ? (
            <Loading />
          ) : (
            <Fragment>
              {this.state.columns.map((col, index) => (
                <Column
                  key={index}
                  {...col}
                  settings={this.state.settings}
                  options={DROPDOWN_OPTIONS}
                  onChange={this.changeHandler}
                />
              ))}
            </Fragment>
          )}
        </Flex>
      </Fragment>
    )
  }
}

export default connect(
  ({ user, deals, contacts }) => ({
    user,
    dealsContexts: selectContextsByBrand(deals.contexts, getActiveTeamId(user)),
    contactsAttributeDefs: contacts.attributeDefs
  }),
  {
    getContextsByBrand,
    getAttributeDefs
  }
)(ReminderNotifications)
