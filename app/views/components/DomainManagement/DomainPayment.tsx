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
import DomainLoading from './DomainLoading'

interface DomainPaymentProps {
  domainPrice: string
  onPayClick: (
    stripeCustomerId: string,
    wizard: IContextState,
    done?: () => void
  ) => void
  disabled: boolean
  step?: number // TODO: Remove this
}

const defaultCustomers: IStripeCustomer[] = []

function DomainPayment({
  step,
  domainPrice,
  onPayClick,
  disabled
}: DomainPaymentProps) {
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

  const handlePayClick = (stripeCustomerId: string, done?: () => void) => {
    onPayClick(stripeCustomerId, wizard, done)
  }

  const lastPayment = customers.length
    ? customers[customers.length - 1]
    : undefined

  return (
    <QuestionSection step={step}>
      <QuestionTitle>Please add your payment information</QuestionTitle>
      <QuestionForm>
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
    </QuestionSection>
  )
}

export default DomainPayment
