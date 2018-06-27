import styled from 'styled-components'
import PropTypes from 'prop-types'

const propTypes = {
  onClick: PropTypes.func,
  inverse: PropTypes.bool
}

const defaultProps = {
  onClick: () => {},
  inverse: false
}

const ActionButton = styled.button`
  padding: 0.5em 1em;
  line-height: 1;
  border-width: 0;
  border-radius: 3px;
  color: ${props => (props.disabled ? '#333' : '#fff')};
  background: ${props => (props.disabled ? '#cecece' : '#2196f3')};
  :focus {
    outline: none;
  }

  ${props =>
    !props.disabled &&
    `&:hover {
    background: #107CEB;
  }`};

  ${props =>
    props.inverse &&
    !props.disabled &&
    `
   background-color: #fff;
   border: 1px solid #2196f3;
   color: #2196f3;

   &:hover {
     background-color: #2196f3;
     color: #fff;
   }
  `};
`

ActionButton.propTypes = propTypes
ActionButton.defaultProps = defaultProps

export default ActionButton
