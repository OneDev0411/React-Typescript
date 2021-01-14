import React from 'react'
import { Button } from '@material-ui/core'

interface DomainPaymentLastCardProps {
  lastPayment: IStripeCustomer
  onUpdateClick: () => void
  onPayClick: (stripeCustomerId: string) => void
  disabled: boolean
}

function DomainPaymentLastCard({
  lastPayment,
  onUpdateClick,
  onPayClick,
  disabled
}: DomainPaymentLastCardProps) {
  const handlePayClick = () => {
    onPayClick(lastPayment.id)
  }

  return (
    <div>
      Your credit and debit cards
      <br />
      Ending in {lastPayment.source.last4}
      <div>{lastPayment.source.name}</div>
      <div>
        {lastPayment.source.exp_month}/{lastPayment.source.exp_year}
      </div>
      <Button
        variant="outlined"
        color="secondary"
        onClick={onUpdateClick}
        disabled={disabled}
      >
        Update Card
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handlePayClick}
        disabled={disabled}
      >
        Pay with this card
      </Button>
    </div>
  )
}

export default DomainPaymentLastCard
