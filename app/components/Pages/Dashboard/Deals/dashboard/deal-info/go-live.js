import React from 'react'
import { Link } from 'react-router'
import styled from 'styled-components'

import ActionButton from '../../../../../../views/components/Button/ActionButton'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1px;
  height: 3rem;
  align-items: center;
`

export default function GoLive({ deal }) {
  if (!deal.is_draft) {
    return false
  }

  return (
    <Container>
      <div>Draft</div>
      <div>
        <Link to={`/dashboard/deals/create/${deal.id}`}>
          <ActionButton inverse>Go Live</ActionButton>
        </Link>
      </div>
    </Container>
  )
}
