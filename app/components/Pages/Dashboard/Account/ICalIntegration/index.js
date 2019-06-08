import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import { Helmet } from 'react-helmet'

import PageHeader from 'components/PageHeader'
import { getUserTeams } from 'store_actions/user/teams'
import getCalenderFeedSetting from 'models/user/calendar-feed-setting'
import { getTeamAvailableMembers } from 'utils/user-teams'

import Loading from '../../../../Partials/Loading'

import TeamType from './TeamTypes'
import SelectedTypes from './AllTypes'
import GenerateUrl from './GenerateUrl'
import UpdateGenerateUrlInfo from './UpdateGenerateUrlInfo'

import { ICalContainer, PageDescription } from './styled'

class DealTemplates extends React.Component {
  state = {
    feedURl: '',
    selectedTypes: [],
    selectedMembers: {},
    isFetchingSetting: true
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    const { dispatch, user } = this.props
    const { teams } = user

    try {
      const promiseSetting = getCalenderFeedSetting()

      await dispatch(getUserTeams(user))

      const setting = await promiseSetting

      let normalizedSetting = {}

      if (setting.filter && setting.filter.length > 0) {
        setting.filter.forEach(filter => {
          if (filter.users && filter.users.length > 1) {
            normalizedSetting[filter.brand] = filter.users
          } else {
            const filterTeam = teams.filter(
              ({ brand }) => brand.id === filter.brand
            )[0]

            normalizedSetting[filter.brand] = filterTeam
              ? getTeamAvailableMembers(filterTeam).map(({ id }) => id)
              : []
          }
        })
      } else {
        teams.forEach(team => {
          normalizedSetting[team.brand.id] = getTeamAvailableMembers(team).map(
            ({ id }) => id
          )
        })
      }

      this.setState({
        selectedTypes:
          (setting &&
            setting.selected_types.filter(type => type.trim().length)) ||
          [],
        selectedMembers: (setting && normalizedSetting) || {},
        feedURl: (setting && setting.url) || ''
      })
    } catch (e) {
      console.log(e)
      dispatch(
        notify({
          title: 'Could not get calender feed setting',
          status: 'error',
          dismissible: true
        })
      )
    } finally {
      this.setState({ isFetchingSetting: false })
    }
  }

  onChangeSelectAllTypes = selectedTypes => this.setState({ selectedTypes })

  onSelectOneCategoriesTypes = (types, allTypesSelected) => {
    this.setState(state => {
      let selectedTypes = state.selectedTypes.slice()

      types.forEach(type => {
        const isSelected = selectedTypes.includes(type)

        if (allTypesSelected && selectedTypes.includes(type)) {
          selectedTypes = selectedTypes.filter(item => item !== type)
        } else if (!isSelected) {
          selectedTypes.push(type)
        }
      })

      return { selectedTypes }
    })
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
    this.setState(state => ({
      selectedMembers: { ...state.selectedMembers, ...newSelectedTeam }
    }))
  }

  onRemoveTeam = removedTeam => {
    this.setState(state => ({
      selectedMembers: _.omit(state.selectedMembers, removedTeam)
    }))
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
    const { teams } = this.props.user
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
            userTeams={teams}
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
            userTeams={teams}
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

export default connect(({ user }) => ({
  user
}))(DealTemplates)
