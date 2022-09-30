import * as React from 'react'

import { Box, Container } from '@material-ui/core'
import { useTitle } from 'react-use'

import EditEmailSignature from 'components/EditEmailSignature'

interface Props {}

function EmailSignatureSettings(props: Props) {
  useTitle('Email Signature | Settings | Rechat')

  return (
    <>
      <Container maxWidth="md">
        <Box p={3}>
          <EditEmailSignature />
        </Box>
      </Container>
    </>
  )
}

export default EmailSignatureSettings
