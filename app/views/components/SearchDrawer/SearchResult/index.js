import React from 'react'

import ClickOutside from 'react-click-outside'

import Alert from '../../../../components/Pages/Dashboard/Partials/Alert'
import { Body } from '../components/Body'
import { ListContainer } from '../styled'

export function SearchResultList(props) {
  if (props.isLoading) {
    return null
  }

  return (
    <ClickOutside onClickOutside={props.handleClickOutside}>
      {props.error && (
        <Alert
          type={props.error.type === 'error' ? props.error.type : 'warning'}
          message={props.error.message}
        />
      )}
      {props.searchResults && props.searchResults.length > 0 && (
        <ListContainer asDropDown={props.multipleSelection}>
          <Body
            getItemProps={props.getItemProps}
            list={props.searchResults}
            handleSelectItem={props.handleSelectItem}
            ItemRow={props.ItemRow}
          />
        </ListContainer>
      )}
    </ClickOutside>
  )
}
