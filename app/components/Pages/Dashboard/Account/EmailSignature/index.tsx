import * as React from 'react'

import { Box, Container } from '@material-ui/core'
import { useTitle } from 'react-use'

import { RouteComponentProps } from '@app/routes/types'
import { withRouter } from '@app/routes/with-router'
import EditEmailSignature from 'components/EditEmailSignature'

interface Props extends RouteComponentProps {}

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

export default withRouter(EmailSignatureSettings)
