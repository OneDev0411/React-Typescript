import React from 'react'
import styled, { css } from 'styled-components'

const Container = styled.div`
  ${({ theme }) => css`
    position: relative;
    width: 100%;
    height: ${theme.spacing(5)}px;
    background-color: ${theme.palette.grey['500']};
    border-radius: 3px;
    font-size: 15px;
    overflow: hidden;
  `}
`

const Percentage = styled.div`
  ${({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    height: ${theme.spacing(5)}px;
    background-color: ${props =>
      props.percent > 0 ? theme.palette.secondary.main : 'transparent'};
    width: ${props => props.percent}%;
    transition: width 0.6s ease-in;
  `}
`

const Title = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  height: 40px;
  top: 0;
  left: 0.5rem;
  z-index: 1;
  color: ${props => (props.percent > 0 ? '#fff' : '#262626')};
  font-weight: 400;
`

export default function UploadProgress(props) {
  const { progress = {} } = props
  const { percent, filename } = progress

  const amount = props.isUploadFinished ? 100 : percent

  return (
    <Container>
      <Title percent={amount}>
        {!amount && <div>Upload is starting…</div>}

        {amount && amount < 100 && (
          <div>
            Uploading ‘{filename}’ …{' '}
            <strong>{amount ? amount.toFixed(2) : 0}%</strong>
          </div>
        )}

        {amount === 100 && !props.isUploadFinished && (
          <div>Upload Finished. Storing...</div>
        )}

        {props.isUploadFinished && <div>Upload Finished</div>}
      </Title>

      <Percentage percent={amount} />
    </Container>
  )
}
