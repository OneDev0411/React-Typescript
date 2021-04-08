import React, { FormEvent } from 'react'
import { Button, makeStyles, Typography } from '@material-ui/core'

import DomainPaymentActions from './DomainPaymentActions'

const useStyles = makeStyles(
  theme => ({
    title: {
      fontWeight: theme.typography.fontWeightBold
    },
    bold: {
      paddingLeft: theme.spacing(1),
      fontWeight: theme.typography.fontWeightBold
    }
  }),
  { name: 'DomainPaymentLastCard' }
)

interface DomainPaymentLastCardProps {
  domainPrice: string
  lastPayment: IStripeCustomer
  onUpdateClick: () => void
  onPayClick: (stripeCustomerId: string) => void
  disabled: boolean
}

function DomainPaymentLastCard({
  domainPrice,
  lastPayment,
  onUpdateClick,
  onPayClick,
  disabled
}: DomainPaymentLastCardProps) {
  const classes = useStyles()
  const handlePayClick = (event: FormEvent) => {
    event.preventDefault()
    onPayClick(lastPayment.id)
  }

  return (
    <form onSubmit={handlePayClick}>
      <Typography className={classes.title} variant="body1" gutterBottom>
        Your card information:
      </Typography>
      <Typography variant="body1" gutterBottom>
        Card number ending in
        <span className={classes.bold}>{lastPayment.source.last4}</span>
      </Typography>
      <Typography variant="body1" gutterBottom>
        Expiration date:
        <span className={classes.bold}>
          {lastPayment.source.exp_month}/{lastPayment.source.exp_year}
        </span>
      </Typography>
      <DomainPaymentActions disabled={disabled} domainPrice={domainPrice}>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          onClick={onUpdateClick}
          disabled={disabled}
        >
          Update Card
        </Button>
      </DomainPaymentActions>
    </form>
  )
}

export default DomainPaymentLastCard
