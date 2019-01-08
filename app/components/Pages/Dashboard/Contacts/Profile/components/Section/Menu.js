import styled from 'styled-components'
import React from 'react'
import PropTypes from 'prop-types'

import TextIconButton from '../../../../../../../views/components/Button/TextIconButton'
import Button from '../../../../../../../views/components/Button/ActionButton'
import EditIcon from '../../../../../../../views/components/SvgIcons/Edit/EditIcon'
import { primary, grey } from '../../../../../../../views/utils/colors'
import { BasicDropdown } from '../../../../../../../views/components/BasicDropdown'

const Item = styled(Button)`
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

    if (items.length === 1) {
      return (
        <TextIconButton
          appearance="outline"
          iconLeft={EditIcon}
          onClick={this.props.onEdit || this.props.onAdd}
          size="small"
          text="Update"
        />
      )
    }

    return (
      <BasicDropdown
        items={items}
        pullTo="right"
        buttonRenderer={props => (
          <TextIconButton
            text="Update"
            appearance="outline"
            size="small"
            iconLeft={EditIcon}
            {...props}
          />
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
