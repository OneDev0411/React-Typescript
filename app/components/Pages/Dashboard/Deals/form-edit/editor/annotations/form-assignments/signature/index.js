import React from 'react'
import styled from 'styled-components'

const Image = styled.img`
  max-height: 100%;
  margin: 0 auto;
  display: block;
`

export default function SignatureAssignment() {
  return <Image src="/static/images/deals/forms/sign.png" alt="" />
}
