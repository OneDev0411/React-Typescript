import React from 'react'

import { brandBackground } from 'views/utils/colors'
import EmailAssociation from 'components/CRMEmailAssociation'

import { MetaInfo } from './MetaInfo'
import { Container } from '../CRMTaskItem/styled'

export default function AutoEmailItem({ email }) {
  return (
    <Container style={{ backgroundColor: brandBackground }}>
      <MetaInfo scheduledFor={email.due_date} />
      <EmailAssociation
        association={{ email: { ...email, body: email.html } }}
      />
    </Container>
  )
}
