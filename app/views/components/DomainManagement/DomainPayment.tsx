import React, { useEffect, useState } from 'react'

import { QuestionForm, QuestionTitle } from 'components/QuestionWizard'
import { IWizardState } from 'components/QuestionWizard/context'
import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import useAsync from 'hooks/use-async'
import getStripeCustomers from 'models/payments/get-stripe-customers'

import DomainLoading from './DomainLoading'
import DomainPaymentForm from './DomainPaymentForm'
import DomainPaymentLastCard from './DomainPaymentLastCard'

interface DomainPaymentProps {
  domainPrice: string
  onPayClick: (
    stripeCustomerId: string,
    wizard: IWizardState,
    done?: () => void
  ) => void
  disabled: boolean
}

const defaultCustomers: IStripeCustomer[] = []

function DomainPayment({
  domainPrice,
  onPayClick,
  disabled
}: DomainPaymentProps) {
  const [showForm, setShowForm] = useState(false)
  const wizard = useWizardContext()

  const {
    data: customers,
    run,
    isLoading: isLoadingCustomers
  } = useAsync({
    data: defaultCustomers
  })

  useEffect(() => {
    run(async () => {
      const customers = await getStripeCustomers()

      setShowForm(!customers.length)

      return customers
    })
  }, [run])

  const handleUpdateClick = () => setShowForm(true)

  const handleCancelClick = () => setShowForm(false)

  const handlePayClick = (stripeCustomerId: string, done?: () => void) => {
    onPayClick(stripeCustomerId, wizard, done)
  }

  const lastPayment = customers.length
    ? customers[customers.length - 1]
    : undefined

  return (
    <>
      <QuestionTitle>Please add your payment information</QuestionTitle>
      <QuestionForm width="85%">
        {isLoadingCustomers ? (
          <DomainLoading />
        ) : lastPayment && !showForm ? (
          <DomainPaymentLastCard
            domainPrice={domainPrice}
            lastPayment={lastPayment}
            onUpdateClick={handleUpdateClick}
            onPayClick={handlePayClick}
            disabled={disabled}
          />
        ) : (
          <DomainPaymentForm
            domainPrice={domainPrice}
            lastPaymentId={lastPayment?.id}
            onCancelClick={lastPayment ? handleCancelClick : undefined}
            onPayClick={handlePayClick}
            disabled={disabled}
          />
        )}
      </QuestionForm>
    </>
  )
}

export default DomainPayment
