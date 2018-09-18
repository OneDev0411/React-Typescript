import React from 'react'
import styled, { keyframes } from 'styled-components'
import PropTypes from 'prop-types'

const infinityLoading = keyframes`
  from {
    left: 0;
  }

  to {
    left: 100%;
  }
`

const Container = styled.div`
  position: relative;
  display: flex;
  width: 30rem;
  height: 16px;
  border: 1px solid #f3f3f3;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;
`

const Bar = styled.div`
  background-color: rgb(0, 59, 223);
  width: ${props => props.percents}%;
  transition: width 0.2s ease-in;
  max-width: 100%;

  ${props =>
    props.indeterminate &&
    `
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 30%
    animation: ${infinityLoading} 1.5s linear infinite;
  `};
`

function ProgressBar(props) {
  return (
    <Container>
      <Bar percents={props.percents} indeterminate={props.indeterminate} />
    </Container>
  )
}

ProgressBar.propTypes = {
  percents: PropTypes.number.isRequired,
  indeterminate: PropTypes.bool
}

ProgressBar.defaultProps = {
  indeterminate: false
}

export default ProgressBar
