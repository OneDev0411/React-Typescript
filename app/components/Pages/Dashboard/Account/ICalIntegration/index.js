import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import { Helmet } from 'react-helmet'

import { ICalContainer, PageDescription } from './styled'

import TeamType from './TeamTypes'
import SelectedTypes from './AllTypes'
import GenerateUrl from './GenerateUrl'
import UpdateGenerateUrlInfo from './UpdateGenerateUrlInfo'
import getCalenderFeedSetting from '../../../../../models/user/calendar-feed-setting'
import getTeams from '../../../../../store_actions/user/teams'

import Loading from '../../../../Partials/Loading'
import PageHeader from '../../../../../views/components/PageHeader'

class DealTemplates extends React.Component {
  state = {
    selectedTypes: [],
    selectedMembers: {},
    isFetchingSetting: true,
    feedURl: ''
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    try {
      const promiseSetting = getCalenderFeedSetting()

      await this.props.getTeams(this.props.user, true)

      const setting = await promiseSetting

      let normalizedSetting = {}

      if (setting.filter && setting.filter.length > 0) {
        setting.filter.forEach(filter => {
          if (filter.users && filter.users.length > 1) {
            normalizedSetting[filter.brand] = filter.users
          } else {
            const filterTeam = this.props.userTeams.filter(
              ({ brand }) => brand.id === filter.brand
            )[0]

            let members = []

            filterTeam &&
              filterTeam.brand.roles.forEach(
                role =>
                  (members = members.concat(role.members.map(({ id }) => id)))
              )

            normalizedSetting[filter.brand] = members
          }
        })
      } else {
        this.props.userTeams.forEach(team => {
          let members = []

          team &&
            team.brand.roles.forEach(
              role =>
                (members = members.concat(role.members.map(({ id }) => id)))
            )

          normalizedSetting[team.brand.id] = members
        })
      }

      this.setState({
        selectedTypes: (setting && setting.selected_types) || [],
        selectedMembers: (setting && normalizedSetting) || {},
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

  onSelectOneCategoriesTypes = (types, selected) => {
    let selectedTypes = this.state.selectedTypes.slice(0)

    types.forEach(selectedType => {
      if (selected && selectedTypes.includes(selectedType)) {
        selectedTypes = selectedTypes.filter(type => type !== selectedType)
      } else {
        selectedTypes.push(selectedType)
      }
    })

    this.setState({ selectedTypes })
  }

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

  onSelectTeam = newSelectedTeam => {
    this.setState({
      selectedMembers: { ...this.state.selectedMembers, ...newSelectedTeam }
    })
  }

  onRemoveTeam = removedTeam => {
    const newSelectedMembers = _.omit(this.state.selectedMembers, removedTeam)

    this.setState({
      selectedMembers: newSelectedMembers
    })
  }

  onChangeSelectedMember = (brandId, selectedMember) => {
    const { selectedMembers } = this.state

    if (selectedMembers[brandId]) {
      if (selectedMembers[brandId].includes(selectedMember)) {
        if (selectedMembers[brandId].length > 1) {
          this.setState({
            selectedMembers: {
              ...selectedMembers,
              [brandId]: selectedMembers[brandId].filter(
                user => user !== selectedMember
              )
            }
          })
        } else {
          this.setState({
            selectedMembers: _.omit(selectedMembers, brandId)
          })
        }
      } else {
        this.setState({
          selectedMembers: {
            ...selectedMembers,
            [brandId]: selectedMembers[brandId].concat(selectedMember)
          }
        })
      }
    } else {
      this.setState({
        selectedMembers: {
          ...selectedMembers,
          [brandId]: [selectedMember]
        }
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
        <Helmet>
          <title>Calendar Export | Settings | Rechat</title>
        </Helmet>
        <PageHeader
          isFlat
          style={{
            marginBottom: '1.5em',
            marginTop: '1.5rem'
          }}
        >
          <PageHeader.Title showBackButton={false}>
            <PageHeader.Heading>Calendar Export</PageHeader.Heading>
          </PageHeader.Title>
        </PageHeader>
        <ICalContainer>
          <PageDescription>
            With calendar export, you can transfer any date based information on
            Rechat into your local calendar experience.
          </PageDescription>
          <TeamType
            userTeams={this.props.userTeams}
            selectedMembers={selectedMembers}
            onChangeSelectAllMembers={this.onChangeSelectAllMembers}
            onChangeSelectedMember={this.onChangeSelectedMember}
            onSelectTeam={this.onSelectTeam}
            onRemoveTeam={this.onRemoveTeam}
          />
          <SelectedTypes
            selectedTypes={selectedTypes}
            onChangeSelectedTypes={this.onChangeSelectedTypes}
            onChangeSelectAllTypes={this.onChangeSelectAllTypes}
            onSelectOneCategoriesTypes={this.onSelectOneCategoriesTypes}
          />
          <GenerateUrl
            userTeams={this.props.userTeams}
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
    userTeams: user.teams,
    user
  }),
  {
    notify,
    getTeams
  }
)(DealTemplates)
