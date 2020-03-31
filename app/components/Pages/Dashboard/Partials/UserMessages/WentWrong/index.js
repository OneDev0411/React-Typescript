import React from 'react'
import PropTypes from 'prop-types'

import Button from 'components/Button/ActionButton'
import IntercomTrigger from 'components/IntercomTrigger'

class WentWrong extends React.Component {
  static propTypes = {
    onClickSupport: PropTypes.func
  }

  static defaultProps = {
    onClickSupport() {}
  }

  render() {
    const { onClickSupport } = this.props

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        You have encountered an unknown system issue. We're working on it. In
        the meantime, connect with our
        <IntercomTrigger
          key="MLS_SEARCH_MODAL__INERCOM_TRIGGER"
          render={({ activeIntercom, isIntercomActive }) => (
            <Button
              size="large"
              appearance="link"
              onClick={
                isIntercomActive
                  ? () => false
                  : () => {
                      onClickSupport()
                      activeIntercom()
                    }
              }
              style={{
                fontSize: 'inherit',
                fontWeight: 600,
                height: 'auto',
                lineHeight: 1,
                padding: ' 0 0 0 0.5rem'
              }}
            >
              Support team
            </Button>
          )}
        />
        .
      </div>
    )
  }
}

export default WentWrong
