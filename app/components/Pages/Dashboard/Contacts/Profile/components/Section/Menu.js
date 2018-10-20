import React from 'react'
import PropTypes from 'prop-types'

import IconButton from '../../../../../../../views/components/Button/IconButton'
import Button from '../../../../../../../views/components/Button/ActionButton'
import { primary, grey } from '../../../../../../../views/utils/colors'
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
        label: 'Edit',
        onClick: this.props.onEdit
      })
    }

    if (this.props.onAdd) {
      items.push({
        label: 'Add Custom Field',
        onClick: this.props.onAdd
      })
    }

    return items
  }

  render() {
    const items = this.getItems()

    if (items.length === 0) {
      return null
    }

    return (
      <BasicDropdown
        items={items}
        pullTo="right"
        buttonRenderer={props => (
          <IconButton isFit iconSize="large" inverse {...props}>
            <MenuIcon style={{ fill: grey.A550 }} className="menu__icon" />
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
