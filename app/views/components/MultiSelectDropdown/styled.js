import Button from 'components/Button/ActionButton'
import { primary } from '../../utils/colors'

export const MenuItem = Button.extend`
  color: #000 !important;
  border-radius: 0;
  border-bottom: ${props => (props.hasDevider ? '1px solid #d4d4d4' : 'none')};
  cursor: ${props => (props.isDisabled ? 'not-allowed' : 'cursor')};

  ${props =>
    !props.isDisabled &&
    `
    :hover {
      color: #fff !important;
      background-color: ${primary};
    }
  `};
`
