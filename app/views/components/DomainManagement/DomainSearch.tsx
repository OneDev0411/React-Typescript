import React from 'react'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'
import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import useAsync from 'hooks/use-async'
import suggestDomainName from 'models/domains/suggest-domain-name'

import DomainSearchResults from './DomainSearchResults'
import DomainSearchForm from './DomainSearchForm'

interface DomainSearchProps {
  domainName: string
  onSelectDomainName: (domainName: string, price: string) => void
  disabled: boolean
}

const defaultSearchResult: IDomainSuggest[] = []

function DomainSearch({
  domainName,
  onSelectDomainName,
  disabled
}: DomainSearchProps) {
  const wizard = useWizardContext()

  const { data: searchResults, run, isLoading } = useAsync({
    data: defaultSearchResult
  })

  const handleSelectDomain = (domainName: string, price: string) => {
    onSelectDomainName(domainName, price)
    wizard.next()
  }

  const handleSearch = (search: string) => {
    onSelectDomainName('', '')
    run(async () => suggestDomainName(search))
  }

  return (
    <QuestionSection>
      <QuestionTitle>Great, search for a domain</QuestionTitle>
      <QuestionForm width="85%">
        <DomainSearchForm
          disabled={disabled || isLoading}
          isLoading={isLoading}
          onSubmit={handleSearch}
        />
        <DomainSearchResults
          items={searchResults}
          onSelectDomain={handleSelectDomain}
          domainName={domainName}
          disabled={disabled}
          isLoading={isLoading}
        />
      </QuestionForm>
    </QuestionSection>
  )
}

export default DomainSearch
