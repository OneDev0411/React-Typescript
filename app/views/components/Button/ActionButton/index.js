import styled from 'styled-components'
import PropTypes from 'prop-types'

const propTypes = {
  onClick: PropTypes.func
}

const defaultTypes = {
  onClick: () => {}
}

const ActionButton = styled.button`
  padding: 0.5em 1em;
  line-height: 1;
  border-width: 0;
  border-radius: 3px;
  color: ${props => (props.disabled ? '#333' : '#fff')};
  background: ${props => (props.disabled ? '#cecece' : '#2196f3')};

  ${props =>
    !props.disabled &&
    `&:hover {
    background: #107CEB;
  }`};
`

ActionButton.propTypes = propTypes
ActionButton.defaultProps = defaultTypes

export default ActionButton
