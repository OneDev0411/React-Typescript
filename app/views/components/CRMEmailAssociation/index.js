import React from 'react'
import PropTypes from 'prop-types'

import MailAttachmentIcon from 'components/SvgIcons/MailAttachment/IconMailAttachment'
import LongArrowRightIcon from 'components/SvgIcons/LongArrowRight/IconLongArrowRight'

import Container from './styled'

CRMEmailAssociation.propTypes = {
  association: PropTypes.shape().isRequired,
  style: PropTypes.shape()
}

CRMEmailAssociation.defaultProps = {
  style: {}
}

function CRMEmailAssociation({ association, style }) {
  if (!association.email) {
    return null
  }

  const { email } = association

  return (
    <Container style={style}>
      <div
        className={`cover ${email.img ? 'img' : 'icon'}`}
        style={{ backgroundImage: email.img && `url(${email.img})` }}
      >
        {!email.img && <MailAttachmentIcon />}
      </div>
      <div className="details">
        <div className="subject">
          <div className="subject__text">{email.subject}</div>
          <LongArrowRightIcon className="subject__icon" />
        </div>
        <div className="body">{email.body}</div>
      </div>
    </Container>
  )
}

export default CRMEmailAssociation
