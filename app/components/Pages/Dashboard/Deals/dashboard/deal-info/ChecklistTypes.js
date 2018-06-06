import React from 'react'
import styled from 'styled-components'

const ChecklistTypesComponent = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  height: 3rem;
  align-items: center;
`

export default function ChecklistTypes({ propertyType }) {
  return (
    <ChecklistTypesComponent>
      <div>Checklist Type</div>
      <div>{propertyType}</div>
    </ChecklistTypesComponent>
  )
}
