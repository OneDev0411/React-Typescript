import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { mdiEmailOpenOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import Container from './styled'
import { EmailAssociationController } from './EmailAssociationController'

CRMEmailAssociation.propTypes = {
  association: PropTypes.shape().isRequired,
  style: PropTypes.shape()
}

CRMEmailAssociation.defaultProps = {
  style: {}
}

function CRMEmailAssociation({ association, style }) {
  const [open, setOpen] = useState(false)

  if (!association.email) {
    return null
  }

  const { email } = association

  return (
    <>
      <Container style={style} onClick={() => setOpen(true)}>
        <div
          className={`cover ${email.img ? 'img' : 'icon'}`}
          style={{ backgroundImage: email.img && `url(${email.img})` }}
        >
          {!email.img && <SvgIcon path={mdiEmailOpenOutline} />}
        </div>
        <div className="details">
          <div className="subject">
            <div className="subject__text">{email.subject}</div>
          </div>
          <div className="body">{email.body}</div>
        </div>
      </Container>
      {open && (
        <EmailAssociationController
          email={email.email}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

export default CRMEmailAssociation
