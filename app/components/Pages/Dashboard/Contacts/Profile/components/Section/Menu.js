import React from 'react'
import PropTypes from 'prop-types'

import IconButton from '../../../../../../../views/components/Button/IconButton'
import Button from '../../../../../../../views/components/Button/ActionButton'
import { primary } from '../../../../../../../views/utils/colors'
import MenuIcon from '../../../../../../../views/components/SvgIcons/MoreVert/IconMoreVert'
import { BasicDropdown } from '../../../../../../../views/components/BasicDropdown'

const Item = Button.extend`
  color: #000;

  &:hover {
    color: #fff !important;
    background-color: ${primary};
  }
`

export class Menu extends React.Component {
  static propTypes = {
    onAdd: PropTypes.func,
    onEdit: PropTypes.func
  }

  getItems = () => {
    let items = []

    if (this.props.onEdit) {
      items.push({
        label: 'Edit all properties',
        onClick: this.props.onEdit,
        value: ''
      })
    }

    if (this.props.onAdd) {
      items.push({
        label: 'Add a property',
        onClick: this.props.onAdd,
        value: ''
      })
    }
  }

  render() {
    return (
      <BasicDropdown
        items={this.getItems()}
        buttonRenderer={props => (
          <IconButton isFit inverse {...props}>
            <MenuIcon />
          </IconButton>
        )}
        onChange={item => item.onClick()}
        itemRenderer={({ item, ...rest }) => (
          <Item
            appearance="link"
            key={item.label}
            style={{ width: '100%' }}
            {...rest}
          >
            {item.label}
          </Item>
        )}
      />
    )
  }
}
