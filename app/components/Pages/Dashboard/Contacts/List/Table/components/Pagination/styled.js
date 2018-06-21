import ActionButton from '../../../../../../../../views/components/Button/ActionButton'

const SELECTED_BGC = '#2196f3'

export const Button = ActionButton.extend`
  border-width: 1px;
  border-style: solid;
  border-color: ${props => (props.selected ? SELECTED_BGC : '#CAD4DB')};

  &:not(:last-of-type) {
    border-radius: 0;
    border-right-width: 0;
  }

  &:first-of-type {
    border-radius: 3px 0 0 3px;
  }

  &:last-of-type {
    border-radius: 0 3px 3px 0;
  }

  ${props =>
    props.disabled
      ? `
        pointer-event: none; 
        color: ${props.text === '...' ? '#17283a' : '#d4dfe6'};
        background: #f0f4f7;
        `
      : `
        font-weight: 600;
        color: ${props.selected ? '#fff' : '#17283a'};
        background: ${props.selected ? SELECTED_BGC : '#fff'};
        
        &:hover {
          color: #fff;
          background: ${SELECTED_BGC};
          border-color: ${SELECTED_BGC};
        }
        
    `};
`
