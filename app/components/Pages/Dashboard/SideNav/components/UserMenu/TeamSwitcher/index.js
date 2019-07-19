import React, { Fragment } from 'react'
import Flex from 'styled-flex-component'
import idx from 'idx/lib/idx'

import Avatar from '../../../../../../../views/components/UserAvatar'

import { putUserSetting } from '../../../../../../../models/user/put-user-setting'

import { primary } from '../../../../../../../views/utils/colors'

import flattenBrand from '../../../../../../../utils/flatten-brand'
import CheckmarkIcon from '../../../../../../../views/components/SvgIcons/Checkmark/IconCheckmark'
import Loading from '../../../../../../../views/components/SvgIcons/CircleSpinner/IconCircleSpinner'

import { viewAs, getActiveTeamId } from '../../../../../../../utils/user-teams'
import { selectTeamIsFetching } from '../../../../../../../reducers/user'

import ViewAsFilter from './ViewAsFilter'
import { TeamName, Button } from './styled'
import { ListItemDivider } from '../../../styled'

export default class TeamSwitcher extends React.Component {
  state = {
    savingTeam: false
  }

  get ActiveTeam() {
    return getActiveTeamId(this.props.user)
  }

  getAvatar(brand) {
    const flatted = flattenBrand(brand)

    return (
      <Avatar
        round
        showStateIndicator={false}
        name={flatted.name}
        size={30}
        src={flatted.assets ? flatted.assets.site_logo : null}
        color="#000000"
      />
    )
  }

  changeTeam = (e, team) => {
    e.preventDefault()

    this.setState({ savingTeam: team.brand.id }, async () => {
      await putUserSetting(
        'user_filter',
        viewAs(this.props.user, this.propsteam),
        team.brand.id
      )
      window.location.reload(true)
    })
  }

  renderTeam = team => {
    const { savingTeam } = this.state
    const isActiveTeam = team.brand.id === this.ActiveTeam

    return [
      <li key={team.brand.id}>
        <Button
          appearance="link"
          disabled={savingTeam}
          isSelected={isActiveTeam}
          onClick={e => this.changeTeam(e, team)}
        >
          <Flex alignCenter style={{ width: 'calc(100% - 2.25rem)' }}>
            {this.getAvatar(team.brand)}

            <TeamName>{team.brand.name}</TeamName>
          </Flex>
          <Flex alignCenter>
            {!savingTeam && isActiveTeam && (
              <CheckmarkIcon style={{ fill: primary }} />
            )}

            {savingTeam === team.brand.id && (
              <Loading style={{ width: '2.25rem', height: '2.25rem' }} />
            )}
          </Flex>
        </Button>
        <ViewAsFilter team={team} isActive={isActiveTeam && !savingTeam} />
      </li>,
      <ListItemDivider key={`sp_${team.brand.id}`} role="separator" />
    ]
  }

  render() {
    const { user } = this.props

    if (selectTeamIsFetching(user)) {
      return (
        <Fragment>
          <Flex center>
            <Loading />
          </Flex>
          <ListItemDivider role="separator" />
        </Fragment>
      )
    }

    if (idx(user, u => u.teams[0].brand.roles)) {
      return user.teams.map(this.renderTeam)
    }

    return null
  }
}
