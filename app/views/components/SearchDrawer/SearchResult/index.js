import React from 'react'
import ClickOutside from 'react-click-outside'

import { ListContainer } from '../styled'
import { Body } from '../components/Body'

import Alert from '../../../../components/Pages/Dashboard/Partials/Alert'

export function SearchResultList(props) {
  if (props.isLoading || props.searchResults.length === 0) {
    return false
  }

  return (
    <ClickOutside onClickOutside={props.handleClickOutside}>
      <ListContainer asDropDown>
        {props.error && (
          <Alert
            type={props.error.type === 'error' ? props.error.type : 'warning'}
            message={props.error.message}
          />
        )}

        <Body
          isDropDown
          getItemProps={props.getItemProps}
          list={props.searchResults}
          handleSelectItem={props.handleSelectItem}
          {...props.listsSharedProps}
        />
      </ListContainer>
    </ClickOutside>
  )
}
