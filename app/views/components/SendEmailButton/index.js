import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ActionButton from 'components/Button/ActionButton'
import EmailCompose from 'components/EmailCompose'

function SendEmailButton(props) {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpenDrawer = () => setIsOpen(!isOpen)

  return (
    <Fragment>
      <ActionButton
        appearance="outline"
        style={props.style}
        onClick={toggleOpenDrawer}
      >
        Email
      </ActionButton>

      {isOpen && (
        <EmailCompose
          isOpen
          defaultAttachments={[]}
          from={props.user}
          deal={props.deal}
          onClose={toggleOpenDrawer}
        />
      )}
    </Fragment>
  )
}

function mapStateToProps({ user }) {
  return {
    user
  }
}

SendEmailButton.propTypes = {
  deal: PropTypes.object,
  defaultAttachments: PropTypes.array
}

SendEmailButton.defaultProps = {
  deal: null,
  defaultAttachments: []
}

export default connect(mapStateToProps)(SendEmailButton)
