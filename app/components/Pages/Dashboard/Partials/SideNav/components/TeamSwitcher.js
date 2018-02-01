import React, { Fragment } from 'react'
import cn from 'classnames'
import {
  getActiveTeamId,
  changeActiveTeam
} from '../../../../../../utils/user-teams'
import flattenBrand from '../../../../../../utils/flatten-brand'
import Avatar from '../../../../../Partials/UserAvatar'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      savingTeam: false
    }
  }

  getAvatar(brand) {
    const flatted = flattenBrand(brand)
    const primaryColor = flatted.palette.primary

    return (
      <Avatar
        round
        showStateIndicator={false}
        name={flatted.name}
        size={30}
        src={flatted.assets ? flatted.assets.site_logo : null}
        color={primaryColor}
        fgColor={
          primaryColor && primaryColor.toLowerCase() === '#ffffff' ? '#000' : '#fff'
        }
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
    changeActiveTeam(team.brand.id)
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
        <li className="separator">Switch Accounts</li>
        {user.teams.map(team => {
          const isActiveTeam = team.brand.id === getActiveTeamId(user)

          return [
            <li key={team.brand.id} className="team-account">
              <a href="#" onClick={e => this.changeTeam(e, team)}>
                {this.getAvatar(team.brand)}

                <div className={cn('team-title', { active: isActiveTeam })}>
                  {team.brand.name}
                </div>

                <div className="icon">
                  {!savingTeam &&
                    isActiveTeam && (
                      <img src="/static/images/dashboard/checkmark.svg" alt="" />
                    )}

                  {savingTeam === team.brand.id && (
                    <i className="fa fa-spinner fa-spin" />
                  )}
                </div>
              </a>
            </li>,
            <li key={`sp_${team.brand.id}`} role="separator" className="divider" />
          ]
        })}
      </Fragment>
    )
  }
}
