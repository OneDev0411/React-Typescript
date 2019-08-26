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
        data-test="send-email"
      >
        {props.title}
      </ActionButton>
      {/*
       We conditionally render, beacause of this comment:
       https://gitlab.com/rechat/web/merge_requests/376#note_200055872
       We can either change email compose component to eliminate this
       limitation, or set drawerIsOpen asynchronously in order to
       enable animation
      */}
      <SingleEmailComposeDrawer
        isOpen={isOpen}
        initialValues={{
          attachments: [],
          to: props.recipients,
          from: props.user
        }}
        deal={deal}
        onClose={toggleOpenDrawer}
        onSent={() => {
          toggleOpenDrawer()
          props.onSent()
        }}
        hasDealsAttachments
        getEmail={getEmail}
      />
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
  onSent: PropTypes.func
}

SendEmailButton.defaultProps = {
  deal: null,
  defaultAttachments: [],
  recipients: [],
  appearance: 'outline',
  title: 'Email',
  onSent: () => {}
}

export default connect(mapStateToProps)(SendEmailButton)
