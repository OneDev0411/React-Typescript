import React, { useEffect, useState } from 'react'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'
import getStripeCustomers from 'models/payments/get-stripe-customers'

import useAsync from 'hooks/use-async'

import { useWizardForm } from 'components/QuestionWizard/use-context'

import { IContextState } from 'components/QuestionWizard/context'

import DomainPaymentForm from './DomainPaymentForm'
import DomainPaymentLastCard from './DomainPaymentLastCard'

interface DomainPaymentProps {
  onPurchase: (stripeCustomerId: string, wizard: IContextState) => void
  disabled: boolean
  step?: number // TODO: Remove this
}

const defaultCustomers: IStripeCustomer[] = []

function DomainPayment({ step, onPurchase, disabled }: DomainPaymentProps) {
  const [showForm, setShowForm] = useState(false)
  const wizard = useWizardForm()

  const { data: customers, run, isLoading: isLoadingCustomers } = useAsync({
    data: defaultCustomers
  })

  useEffect(() => {
    run(getStripeCustomers).then(customers => {
      setShowForm(!customers.length)
    })
  }, [run])

  const handleUpdateClick = () => setShowForm(true)

  const handleCancelClick = () => setShowForm(false)

  const handlePayClick = (stripeCustomerId: string) => {
    onPurchase(stripeCustomerId, wizard)
  }

  const lastPayment = customers.length
    ? customers[customers.length - 1]
    : undefined

  if (isLoadingCustomers) {
    return null
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>Payment</QuestionTitle>
      <QuestionForm>
        {lastPayment && !showForm ? (
          <DomainPaymentLastCard
            lastPayment={lastPayment}
            onUpdateClick={handleUpdateClick}
            onPayClick={handlePayClick}
            disabled={disabled}
          />
        ) : (
          <DomainPaymentForm
            lastPaymentId={lastPayment?.id}
            onCancelClick={lastPayment ? handleCancelClick : undefined}
            onPayClick={handlePayClick}
            disabled={disabled}
          />
        )}
      </QuestionForm>
    </QuestionSection>
  )
}

export default DomainPayment
