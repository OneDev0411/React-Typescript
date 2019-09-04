import React from 'react'

import { ButtonBase } from '@material-ui/core'

import { brandBackground } from 'views/utils/colors'
import EmailAssociation from 'components/CRMEmailAssociation'

import { EditEmailButton } from 'components/EditEmailButton'

import { MetaInfo } from './MetaInfo'
import { Container } from '../CRMTaskItem/styled'

export default function AutoEmailItem({ email, onUpdate }) {
  return (
    <Container style={{ backgroundColor: brandBackground }}>
      <MetaInfo scheduledFor={email.due_date} />
      <EditEmailButton onEmailUpdated={onUpdate} emailId={email.id}>
        {({ onClick }) => (
          <ButtonBase
            style={{ width: '100%', textAlign: 'initial' }}
            disableRipple={false}
            onClick={onClick}
          >
            <EmailAssociation
              association={{ email: { ...email, body: email.text } }}
            />
          </ButtonBase>
        )}
      </EditEmailButton>
    </Container>
  )
}
