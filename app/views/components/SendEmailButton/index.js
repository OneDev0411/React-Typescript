import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ActionButton from 'components/Button/ActionButton'
import { SingleEmailComposeDrawer } from 'components/EmailCompose'

function SendEmailButton(props) {
  const { deal } = props
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpenDrawer = () => setIsOpen(!isOpen)

  const getEmail = email => {
    if (deal != null && deal.id) {
      return {
        ...email,
        deal: deal.id
      }
    }

    return email
  }

  return (
    <Fragment>
      <ActionButton
        appearance={props.appearance}
        style={props.style}
        onClick={toggleOpenDrawer}
      >
        {props.title}
      </ActionButton>

      {isOpen && (
        <SingleEmailComposeDrawer
          isOpen
          defaultAttachments={[]}
          recipients={props.recipients}
          from={props.user}
          deal={deal}
          onClose={toggleOpenDrawer}
          onSent={toggleOpenDrawer}
          hasDealsAttachments
          getEmail={getEmail}
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
  defaultAttachments: PropTypes.array,
  recipients: PropTypes.array,
  appearance: PropTypes.string,
  title: PropTypes.string,
  afterSend: PropTypes.func
}

SendEmailButton.defaultProps = {
  deal: null,
  defaultAttachments: [],
  recipients: [],
  appearance: 'outline',
  title: 'Email',
  afterSend: () => {}
}

export default connect(mapStateToProps)(SendEmailButton)
