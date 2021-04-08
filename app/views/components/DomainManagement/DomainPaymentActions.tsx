import React, { ReactNode } from 'react'
import { Box, Button } from '@material-ui/core'

interface DomainPaymentActionsProps {
  disabled: boolean
  domainPrice: string
  children: ReactNode
}

function DomainPaymentActions({
  disabled,
  domainPrice,
  children
}: DomainPaymentActionsProps) {
  return (
    <Box marginTop={3}>
      {children && (
        <Box marginRight={1} display="inline-block">
          {children}
        </Box>
      )}
      <Button
        type="submit"
        color="secondary"
        variant="contained"
        disabled={disabled}
      >
        Pay {domainPrice}
      </Button>
    </Box>
  )
}

export default DomainPaymentActions
