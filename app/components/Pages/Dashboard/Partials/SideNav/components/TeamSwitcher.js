import React, { Fragment } from 'react'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import {
  getActiveTeamId,
  setActiveTeam
} from '../../../../../../utils/user-teams'
import flattenBrand from '../../../../../../utils/flatten-brand'
import Avatar from '../../../../../Partials/UserAvatar'
import CheckmarkIcon from '../../../../../../views/components/SvgIcons/Checkmark/IconCheckmark'
import ActionButton from '../../../../../../views/components/Button/ActionButton'
import { primary } from '../../../../../../views/utils/colors'

const TeamName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 1em;
  max-width: 136px;
`

const Button = ActionButton.extend`
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

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      savingTeam: false
    }
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

  changeTeam(e, team) {
    e.preventDefault()

    const { user } = this.props
    const { savingTeam } = this.state

    if (savingTeam || team.brand.id === getActiveTeamId(user)) {
      return false
    }

    this.setState({ savingTeam: team.brand.id })
    setActiveTeam(team.brand.id)
    window.location.reload(true)
  }

  render() {
    const { user } = this.props
    const { savingTeam } = this.state

    if (!user.teams || user.teams.length <= 1) {
      return false
    }

    return (
      <Fragment>
        <li className="separator">Team Switcher</li>
        {user.teams.map(team => {
          const isActiveTeam = team.brand.id === getActiveTeamId(user)

          return [
            <li key={team.brand.id}>
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
                  {!savingTeam &&
                    isActiveTeam && <CheckmarkIcon style={{ fill: primary }} />}

                  {savingTeam === team.brand.id && (
                    <i className="fa fa-spinner fa-spin" />
                  )}
                </Flex>
              </Button>
            </li>,
            <li
              key={`sp_${team.brand.id}`}
              role="separator"
              className="divider"
            />
          ]
        })}
      </Fragment>
    )
  }
}
