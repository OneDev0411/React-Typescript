import React, { Fragment } from 'react'
import idx from 'idx/lib/idx'
import {
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip
} from '@material-ui/core'

import { putUserSetting } from '../../../../../../../models/user/put-user-setting'

import { primary } from '../../../../../../../views/utils/colors'

import flattenBrand from '../../../../../../../utils/flatten-brand'
import CheckmarkIcon from '../../../../../../../views/components/SvgIcons/Checkmark/IconCheckmark'
import Loading from '../../../../../../../views/components/SvgIcons/CircleSpinner/IconCircleSpinner'

import { viewAs, getActiveTeamId } from '../../../../../../../utils/user-teams'
import { selectTeamIsFetching } from '../../../../../../../reducers/user'

import ViewAsFilter from './ViewAsFilter'
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

    return flatted.name.charAt(0).toUpperCase()
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

    return (
      <>
        <ListItem
          button
          key={team.brand.id}
          disabled={savingTeam}
          selected={isActiveTeam}
          onClick={e => this.changeTeam(e, team)}
        >
          <ListItemAvatar>
            <Avatar>{this.getAvatar(team.brand)}</Avatar>
          </ListItemAvatar>
          <Tooltip title={team.brand.name}>
            <ListItemText primaryTypographyProps={{ noWrap: true }}>
              {team.brand.name}
            </ListItemText>
          </Tooltip>
          <>
            {isActiveTeam && <CheckmarkIcon style={{ fill: primary }} />}

            {savingTeam === team.brand.id && (
              <Loading style={{ width: '2.25rem', height: '2.25rem' }} />
            )}
          </>
        </ListItem>
        <ViewAsFilter team={team} isActive={isActiveTeam} />
      </>
    )
  }

  render() {
    const { user } = this.props

    if (selectTeamIsFetching(user)) {
      return (
        <Fragment>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Loading />
          </Box>
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
