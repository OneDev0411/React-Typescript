import React from 'react'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'
import { useWizardForm } from 'components/QuestionWizard/use-context'
import useAsync from 'hooks/use-async'
import suggestDomainName from 'models/domains/suggest-domain-name'

import DomainSearchResults from './DomainSearchResults'
import DomainSearchForm from './DomainSearchForm'

interface DomainSearchProps {
  domainName: string
  onSelectDomainName: (value: string) => void
  disabled: boolean
  step?: number // TODO: Remove this
}

const defaultSearchResult: IDomainSuggest[] = []

function DomainSearch({
  domainName,
  onSelectDomainName,
  disabled,
  step
}: DomainSearchProps) {
  const wizard = useWizardForm()

  const { data: searchResults, run, isLoading } = useAsync({
    data: defaultSearchResult
  })

  const handleCheckout = () => {
    wizard.next()
  }

  const handleSearch = (search: string) => {
    onSelectDomainName('')
    run(async () => suggestDomainName(search))
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>Search for a domain name</QuestionTitle>
      <QuestionForm>
        <DomainSearchForm
          disabled={disabled || isLoading}
          isLoading={isLoading}
          onSubmit={handleSearch}
        />
        <DomainSearchResults
          items={searchResults}
          onSelectDomain={onSelectDomainName}
          domainName={domainName}
          onCheckoutClick={handleCheckout}
          disabled={disabled || isLoading}
        />
      </QuestionForm>
    </QuestionSection>
  )
}

export default DomainSearch
