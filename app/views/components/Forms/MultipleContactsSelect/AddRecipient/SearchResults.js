import React from 'react'

import { SearchResultsContainer, Title } from './styled'

function SearchResults(props) {
  return (
    <SearchResultsContainer>
      {props.data.map((section, i) => {
        const hasResults = !section.isLoading && section.items.length > 0
        const isShowTitle = section.isLoading === true || hasResults

        return (
          <React.Fragment key={section.id && i}>
            {isShowTitle && (
              <Title>
                {section.title}
                {section.isLoading && (
                  <>
                    &nbsp;
                    <i className="fa fa-spin fa-spinner" />
                  </>
                )}
              </Title>
            )}
            {hasResults &&
              section.items.map((item, i) =>
                section.itemRenderer({ key: item.id || i, item })
              )}
          </React.Fragment>
        )
      })}
    </SearchResultsContainer>
  )
}

export default SearchResults
