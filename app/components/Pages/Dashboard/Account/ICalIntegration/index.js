import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { ICalContainer, PageDescription } from './styled'

import PageTitle from '../components/PageTitle'
import TeamType from './TeamTypes'
import SelectedTypes from './AllTypes'
import GenerateUrl from './GenerateUrl'
import UpdateGenerateUrlInfo from './UpdateGenerateUrlInfo'
import getCalenderFeedSetting from '../../../../../models/user/calendar-feed-setting'
import Loading from '../../../../Partials/Loading'

class DealTemplates extends React.Component {
  state = {
    selectedBrandId: null,
    selectedTypes: [],
    isFetchingSetting: true
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    try {
      const setting = await getCalenderFeedSetting()

      this.setState({
        selectedBrandId: (setting[0] && setting[0].selected_brand) || null,
        selectedTypes: (setting[0] && setting[0].selected_types) || []
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

  onChangeTeam = selectedBrandId => this.setState({ selectedBrandId })

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

  render() {
    const { selectedTypes, selectedBrandId } = this.state

    if (this.state.isFetchingSetting) {
      return <Loading />
    }

    return (
      <Fragment>
        <PageTitle title="iCal Feed" />
        <ICalContainer>
          <PageDescription>
            With iCal export, you can transfer any date based information on
            Rechat into your local iCal experience.
          </PageDescription>
          <TeamType
            userTeams={this.props.userTeams}
            onChangeTeam={this.onChangeTeam}
            selectedBrandId={selectedBrandId}
          />
          <SelectedTypes
            selectedTypes={selectedTypes}
            onChangeSelectedTypes={this.onChangeSelectedTypes}
            onChangeSelectAllTypes={this.onChangeSelectAllTypes}
          />
          <GenerateUrl
            selectedTypes={selectedTypes}
            selectedBrandId={selectedBrandId}
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
