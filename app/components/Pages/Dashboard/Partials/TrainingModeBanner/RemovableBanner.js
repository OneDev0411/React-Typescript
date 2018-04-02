import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'react-bootstrap'

import TeamSwitcher from '../SideNav/components/TeamSwitcher'
import ShadowButton from '../../../../../views/components/Button/ShadowButton'

const CloseButton = ShadowButton.extend`
  position: absolute;
  top: 50%;
  right: 2rem;
  font-size: 0;
  transform: translateY(-50%);
`

export class RemovableBanner extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired
  }

  state = {
    isActive: true
  }

  handleOnClose = () => {
    this.setState({
      isActive: false
    })
  }

  render() {
    if (!this.state.isActive) {
      return null
    }

    return (
      <div
        style={{
          position: 'relative',
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
            <TeamSwitcher user={this.props.user} />
          </Dropdown.Menu>
        </Dropdown>
        <CloseButton onClick={this.handleOnClose}>
          <svg
            fill="#fff"
            height="32"
            viewBox="0 0 24 24"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </CloseButton>
      </div>
    )
  }
}
