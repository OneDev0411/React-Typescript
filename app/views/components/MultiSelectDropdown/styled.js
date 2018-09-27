import Button from 'components/Button/ActionButton'
import { primary } from '../../utils/colors'

export const MenuItem = Button.extend`
  color: #000;
  border-radius: 0;
  border-bottom: ${props => (props.hasDevider ? '1px solid #d4d4d4' : 'none')};

  :hover {
    color: #fff !important;
    background-color: ${primary};
  }
`
