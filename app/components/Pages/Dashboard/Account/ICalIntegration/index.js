import React from 'react'

import { Box, Typography } from '@material-ui/core'
import omit from 'lodash/omit'
import { Helmet } from 'react-helmet'

import { getTeams } from '@app/models/user/get-teams'
import { addNotification as notify } from 'components/notification'
import getCalenderFeedSetting from 'models/user/calendar-feed-setting'
import { getTeamAvailableMembers } from 'utils/user-teams'

import Loading from '../../../../Partials/Loading'

import SelectedTypes from './AllTypes'
import GenerateUrl from './GenerateUrl'
import { ICalContainer, PageDescription } from './styled'
import TeamType from './TeamTypes'
import UpdateGenerateUrlInfo from './UpdateGenerateUrlInfo'

class ICalIntegration extends React.Component {
  state = {
    teams: [],
    feedURl: '',
    selectedTypes: [],
    selectedMembers: {},
    isFetchingSetting: true
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    const { dispatch } = this.props

    try {
      const teams = await getTeams()
      const feed = await getCalenderFeedSetting()
      const hasFeed = feed && Object.keys(feed).length > 0

      let selectedMembers = {}

      if (hasFeed && Array.isArray(feed.filter)) {
        feed.filter.forEach(filter => {
          if (filter.users && filter.users.length > 1) {
            selectedMembers[filter.brand] = filter.users
          } else {
            const filterTeam = teams.filter(
              ({ brand }) => brand.id === filter.brand
            )[0]

            selectedMembers[filter.brand] = filterTeam
              ? getTeamAvailableMembers(filterTeam).map(({ id }) => id)
              : []
          }
        })
      } else {
        teams.forEach(team => {
          selectedMembers[team.brand.id] = getTeamAvailableMembers(team).map(
            ({ id }) => id
          )
        })
      }

      this.setState(() => {
        if (!hasFeed) {
          return {
            teams,
            feedURl: '',
            selectedMembers,
            selectedTypes: []
          }
        }

        return {
          teams,
          feedURl: feed.url || '',
          selectedMembers,
          selectedTypes:
            (Array.isArray(feed.selected_types) &&
              feed.selected_types.filter(type => type.trim().length)) ||
            []
        }
      })
    } catch (e) {
      console.log(e)
      dispatch(
        notify({
          message: 'Could not get calender feed setting',
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
      selectedMembers: omit(state.selectedMembers, removedTeam)
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
            selectedMembers: omit(selectedMembers, brandId)
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
    const { teams, selectedTypes, selectedMembers } = this.state

    if (this.state.isFetchingSetting) {
      return <Loading />
    }

    return (
      <>
        <Helmet>
          <title>Calendar Export | Settings | Rechat</title>
        </Helmet>
        <ICalContainer>
          <PageDescription>
            <Typography variant="body2">
              With calendar export, you can transfer any date based information
              on Rechat into your local calendar experience.
            </Typography>
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
          <Box marginBottom={1}>
            <GenerateUrl
              userTeams={teams}
              selectedTypes={selectedTypes}
              selectedMembers={selectedMembers}
              feedURl={this.state.feedURl}
            />
          </Box>
          <UpdateGenerateUrlInfo />
        </ICalContainer>
      </>
    )
  }
}

export default ICalIntegration
