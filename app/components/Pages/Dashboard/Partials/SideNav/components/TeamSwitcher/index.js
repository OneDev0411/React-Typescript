import React, { Fragment } from 'react'
import styled from 'styled-components'
import Flex from 'styled-flex-component'
import idx from 'idx'

import { viewAs, getActiveTeamId } from '../../../../../../../utils/user-teams'
import { putUserSetting } from '../../../../../../../models/user/put-user-setting'
import flattenBrand from '../../../../../../../utils/flatten-brand'
import CheckmarkIcon from '../../../../../../../views/components/SvgIcons/Checkmark/IconCheckmark'
import ActionButton from '../../../../../../../views/components/Button/ActionButton'
import { primary, borderColor } from '../../../../../../../views/utils/colors'

import Avatar from '../../../../../../Partials/UserAvatar'

import ViewAsFilter from './ViewAsFilter'

const TeamName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 1em;
  max-width: 136px;
`

const Button = styled(ActionButton)`
  width: 100%;
  height: 48px;
  justify-content: space-between;
  color: ${props => (props.isSelected ? primary : '#000')};
  font-weight: ${props => (props.isSelected ? 600 : 400)};
  border-radius: 0;

  &:not([disabled]):hover {
    color: #fff;
    background-color: ${primary};

    svg {
      fill: #fff !important;
    }
  }
`

const Team = styled.li`
  border-bottom: 1px solid ${borderColor};
`

export default class TeamSwitcher extends React.Component {
  state = {
    savingTeam: false
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

    const { user } = this.props
    const { savingTeam } = this.state

    if (savingTeam || team.brand.id === getActiveTeamId(user)) {
      return false
    }

    this.setState({ savingTeam: team.brand.id }, async () => {
      await putUserSetting('user_filter', viewAs(user, team), team.brand.id)
      window.location.reload(true)
    })
  }

  render() {
    const { user } = this.props
    const { savingTeam } = this.state

    if (!idx(user, u => u.teams[0].brand.roles)) {
      return null
    }

    return (
      <div
        style={{ maxHeight: '22rem', overflowY: 'auto' }}
        className="u-scrollbar--thinner--self"
      >
        <li className="separator">Team Switcher</li>
        {user.teams.map(team => {
          const isActiveTeam = team.brand.id === getActiveTeamId(user)

          return [
            <Team key={team.brand.id}>
              <Button
                isSelected={isActiveTeam}
                appearance="link"
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
              <ViewAsFilter
                team={team}
                isActive={isActiveTeam && !savingTeam}
              />
            </Team>
          ]
        })}
      </div>
    )
  }
}
