import React from 'react'

import IconCircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import { SearchResultsContainer, Title } from './styled'

function SearchResults(props) {
  return (
    <SearchResultsContainer {...props.containerProps}>
      {props.data.map((section, i) => {
        const hasResults = !section.isLoading && section.items.length > 0
        const isShowTitle = section.isLoading === true || hasResults

        return (
          <React.Fragment key={section.id || i}>
            {isShowTitle && (
              <Title>
                {section.title}
                {section.isLoading && (
                  <>
                    <IconCircleSpinner />
                  </>
                )}
              </Title>
            )}
            {hasResults &&
              section.items.map((item, i) =>
                section.itemRenderer({
                  key: `${section.title}-${item.id}` || `${section.title}-${i}`,
                  item
                })
              )}
          </React.Fragment>
        )
      })}
    </SearchResultsContainer>
  )
}

export default SearchResults
