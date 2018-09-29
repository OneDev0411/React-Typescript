import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import { ICalContainer, PageDescription } from './styled'

import TeamType from './TeamTypes'
import SelectedTypes from './AllTypes'
import GenerateUrl from './GenerateUrl'
import UpdateGenerateUrlInfo from './UpdateGenerateUrlInfo'
import getCalenderFeedSetting from '../../../../../models/user/calendar-feed-setting'
import Loading from '../../../../Partials/Loading'
import PageHeader from '../../../../../views/components/PageHeader'

class DealTemplates extends React.Component {
  state = {
    selectedTypes: [],
    selectedMembers: [],
    isFetchingSetting: true,
    feedURl: ''
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    try {
      const setting = await getCalenderFeedSetting()

      this.setState({
        selectedTypes: (setting && setting.selected_types) || [],
        selectedMembers: (setting && setting.selected_users) || {},
        feedURl: (setting && setting.url) || ''
      })
    } catch (e) {
      console.log(e)
      this.props.notify({
        title: 'Could not get calender feed setting',
        status: 'error',
        dismissible: true
      })
    } finally {
      this.setState({ isFetchingSetting: false })
    }
  }

  onChangeSelectAllTypes = selectedTypes => this.setState({ selectedTypes })

  onChangeSelectedTypes = selectedType => {
    const { selectedTypes } = this.state

    if (selectedTypes.includes(selectedType)) {
      this.setState({
        selectedTypes: selectedTypes.filter(type => type !== selectedType)
      })
    } else {
      this.setState({ selectedTypes: selectedTypes.concat(selectedType) })
    }
  }
  onChangeSelectAllMembers = selectedMembers =>
    this.setState({ selectedMembers })
  onChangeSelectRole = (roleId, newSelectedMembers) => {
    const { selectedMembers } = this.state

    if (
      selectedMembers[roleId] &&
      selectedMembers[roleId].length === newSelectedMembers.length
    ) {
      this.setState({
        selectedMembers: _.omit(selectedMembers, roleId)
      })
    } else {
      this.setState({
        selectedMembers: { ...selectedMembers, [roleId]: newSelectedMembers }
      })
    }
  }
  onChangeSelectedMember = (roleId, selectedMember) => {
    const { selectedMembers } = this.state

    if (selectedMembers[roleId]) {
      if (selectedMembers[roleId].includes(selectedMember)) {
        this.setState({
          selectedMembers: {
            ...selectedMembers,
            [roleId]: selectedMembers[roleId].filter(
              user => user !== selectedMember
            )
          }
        })
      } else {
        this.setState({
          selectedMembers: {
            ...selectedMembers,
            [roleId]: selectedMembers[roleId].concat(selectedMember)
          }
        })
      }
    } else {
      this.setState({
        selectedMembers: { ...selectedMembers, [roleId]: [selectedMember] }
      })
    }
  }

  render() {
    const { selectedTypes, selectedMembers } = this.state

    if (this.state.isFetchingSetting) {
      return <Loading />
    }

    return (
      <Fragment>
        <PageHeader
          isFlat
          style={{ marginBottom: '1.5em', marginTop: '1.5rem' }}
        >
          <PageHeader.Title showBackButton={false}>
            <PageHeader.Heading>iCal Feed</PageHeader.Heading>
          </PageHeader.Title>
        </PageHeader>
        <ICalContainer>
          <PageDescription>
            With iCal export, you can transfer any date based information on
            Rechat into your local iCal experience.
          </PageDescription>
          <TeamType
            userTeams={this.props.userTeams}
            onChangeTeam={this.onChangeTeam}
            selectedMembers={selectedMembers}
            onChangeSelectAllMembers={this.onChangeSelectAllMembers}
            onChangeSelectedMember={this.onChangeSelectedMember}
            onChangeSelectRole={this.onChangeSelectRole}
          />
          <SelectedTypes
            selectedTypes={selectedTypes}
            onChangeSelectedTypes={this.onChangeSelectedTypes}
            onChangeSelectAllTypes={this.onChangeSelectAllTypes}
          />
          <GenerateUrl
            selectedTypes={selectedTypes}
            selectedMembers={selectedMembers}
            feedURl={this.state.feedURl}
          />
          <UpdateGenerateUrlInfo />
        </ICalContainer>
      </Fragment>
    )
  }
}

export default connect(
  ({ user }) => ({
    userTeams: user.teams
  }),
  { notify }
)(DealTemplates)
