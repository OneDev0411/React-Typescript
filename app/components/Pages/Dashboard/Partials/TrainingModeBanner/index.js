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
        fontSize: '2.4rem',
        color: '#fff',
        background: 'rgb(245, 166, 35, 0.8)'
      }}
    >
      <span>Training Mode On</span>
      <Dropdown
        dropdown
        id="account-dropdown"
        style={{ width: 228, marginTop: 0 }}
        className="c-app-sidenav__account-dropdown"
      >
        <Dropdown.Toggle
          style={{
            background: '#fff',
            color: '#f5a623',
            fontSize: '1.6rem',
            padding: '0.25em 0.75em',
            marginLeft: '1em',
            borderWidth: 0,
            width: 'auto'
          }}
        >
          Switch Teams
        </Dropdown.Toggle>

        <Dropdown.Menu style={{ top: '2.5em', left: '2em' }}>
          <TeamSwitcher user={user} />
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}
