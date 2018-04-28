import React from 'react'
import styled from 'styled-components'

import Header from './Header'
import NewContactForm from './Form'

export const PageContainer = styled.div`
  min-height: 100vh;
  background: #f0f4f7;
`

function NewContact() {
  return (
    <PageContainer>
      <Header />
      <NewContactForm />
    </PageContainer>
  )
}

export default NewContact
