import React, { useState } from 'react'

import { ButtonBase } from '@material-ui/core'

import { brandBackground } from 'views/utils/colors'
import EmailAssociation from 'components/CRMEmailAssociation'

import { EditEmailDrawer } from 'components/EmailCompose'

import { MetaInfo } from './MetaInfo'
import { Container } from '../CRMTaskItem/styled'

export default function AutoEmailItem({ email }) {
  const [isEmailOpen, setEmailOpen] = useState(false)

  return (
    <Container style={{ backgroundColor: brandBackground }}>
      <MetaInfo scheduledFor={email.due_date} />
      <ButtonBase
        disableRipple={false}
        onClick={() => {
          setEmailOpen(true)
        }}
      >
        <EmailAssociation
          association={{ email: { ...email, body: email.text } }}
        />
      </ButtonBase>
      {isEmailOpen && (
        <EditEmailDrawer
          isOpen
          onClose={() => setEmailOpen(false)}
          email={email}
        />
      )}
    </Container>
  )
}
