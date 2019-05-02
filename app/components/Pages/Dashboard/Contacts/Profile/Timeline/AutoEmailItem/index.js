import React from 'react'
import styled from 'styled-components'

import { brandBackground } from 'views/utils/colors'
import EmailAssociation from 'components/CRMEmailAssociation'

import { MetaInfo } from './MetaInfo'
import { Container } from '../CRMTaskItem/styled'

const ItemContainer = styled(Container)`
  background-color: ${brandBackground};
`

export default function AutoEmailItem({ email }) {
  return (
    <ItemContainer>
      <MetaInfo scheduledFor={email.due_date} />
      <EmailAssociation
        association={{ email: { ...email, body: email.html } }}
      />
    </ItemContainer>
  )
}
