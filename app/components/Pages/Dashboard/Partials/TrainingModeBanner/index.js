import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'react-bootstrap'

import TeamSwitcher from '../SideNav/components/TeamSwitcher'

TrainingModeBanner.propTypes = {
  user: PropTypes.shape().isRequired
}

export function TrainingModeBanner({ user }) {
  return (
    <div
      style={{
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        color: '#fff',
        background: '#f4b656'
      }}
    >
      <span>Training Mode On</span>
      {Array.isArray(user.teams) &&
        user.teams.length > 1 && (
          <Dropdown
            id="account-dropdown"
            style={{
              width: 'auto',
              marginTop: 0,
              height: 'auto',
              border: 'none'
            }}
            className="c-app-sidenav__account-dropdown"
          >
            <Dropdown.Toggle
              style={{
                background: '#fff',
                color: '#f5a623',
                padding: '0.25em 0.75em',
                marginLeft: '1rem',
                borderWidth: 0,
                width: 'auto'
              }}
            >
              Switch Teams
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ top: '2.2rem' }}>
              <TeamSwitcher user={user} />
            </Dropdown.Menu>
          </Dropdown>
        )}
    </div>
  )
}
