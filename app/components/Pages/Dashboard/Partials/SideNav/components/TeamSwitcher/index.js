import React, { Fragment } from 'react'
import styled from 'styled-components'
import Flex from 'styled-flex-component'
import idx from 'idx'

import { selectTeamIsFetching } from '../../../../../../../reducers/user'
import { viewAs, getActiveTeamId } from '../../../../../../../utils/user-teams'
import { putUserSetting } from '../../../../../../../models/user/put-user-setting'
import flattenBrand from '../../../../../../../utils/flatten-brand'
import CheckmarkIcon from '../../../../../../../views/components/SvgIcons/Checkmark/IconCheckmark'
import Loading from '../../../../../../../views/components/SvgIcons/CircleSpinner/IconCircleSpinner'

import { primary, borderColor } from '../../../../../../../views/utils/colors'

import Avatar from '../../../../../../Partials/UserAvatar'

import ViewAsFilter from './ViewAsFilter'
import { TeamName, Button } from './styled'

const Team = styled.li`
  border-bottom: 1px solid ${borderColor};
`

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
          <Flex alignCenter>
            {this.getAvatar(team.brand)}

            <TeamName>{team.brand.name}</TeamName>
          </Flex>
          <Flex alignCenter>
            {!savingTeam && isActiveTeam && (
              <CheckmarkIcon style={{ fill: primary }} />
            )}

            {savingTeam === team.brand.id && (
              <i className="fa fa-spinner fa-spin" />
            )}
          </Flex>
        </Button>
        <ViewAsFilter team={team} isActive={isActiveTeam && !savingTeam} />
      </li>,
      <li key={`sp_${team.brand.id}`} role="separator" className="divider" />
    ]
  }

  render() {
    const { user } = this.props

    if (selectTeamIsFetching(user)) {
      return (
        <Fragment>
          <Flex center>
            <Loading style={{ fill: primary }} />
          </Flex>
          <li role="separator" className="divider" />
        </Fragment>
      )
    }

    if (idx(user, u => u.teams[0].brand.roles)) {
      return user.teams.map(this.renderTeam)
    }

    return null
  }
}
