import styled from 'styled-components'
import PropTypes from 'prop-types'

const propTypes = {
  onClick: PropTypes.func.isRequired
}

const CancelButton = styled.button`
  padding: 0.5em 1em;
  line-height: 1;
  color: #333;
  border-width: 0;
  border-radius: 3px;
  background: #cecece;

  &:hover {
    color: #fff;
    background: #2196f3;
  }
`

CancelButton.propTypes = propTypes

export default CancelButton
