import React from 'react'

import { NotifyOffice } from '../../NotifyOffice'

import { Container, Title, NotifyOfficeContainer } from './styled'

export function Item(props) {
  const isSelected =
    props.selectedItem.type === props.type && props.selectedItem.id === props.id

  const notifyOffice = isSelected ? props.notifyOffice : false

  return (
    <Container key={props.id}>
      <Title
        isSelected={isSelected}
        onClick={() =>
          props.onSelectItem({
            type: props.type,
            id: props.id,
            checklistId: props.checklist.id
          })
        }
      >
        {props.title}
      </Title>

      <NotifyOfficeContainer display={isSelected}>
        <NotifyOffice
          type={props.type}
          id={props.id}
          isSelected={notifyOffice}
          checklist={props.checklist}
          onChange={props.onToggleNotifyOffice}
        />
      </NotifyOfficeContainer>
    </Container>
  )
}
