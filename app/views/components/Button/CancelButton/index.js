import styled from 'styled-components'
import PropTypes from 'prop-types'

const propTypes = {
  onClick: PropTypes.func.isRequired
}

const CancelButton = styled.button`
  padding: 0.5em 1em;
  line-height: 1;
  color: #2196f3;
  border-radius: 3px;
  border: 1px solid #ccc;
  background: #fff;
  transition: all 0.23s ease-out;

  &:hover {
    color: #fff;
    background: #2196f3;
    border-color: #2196f3;
  }
`

CancelButton.propTypes = propTypes

export default CancelButton
