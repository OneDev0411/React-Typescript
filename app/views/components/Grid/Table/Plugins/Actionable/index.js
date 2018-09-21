import React from 'react'
import styled from 'styled-components'
import ActionButton from '../../../../Button/ActionButton'

const ActionItem = styled.div`
  margin-left: 8px;
`

export class ActionablePlugin {
  constructor({ actions, selectablePlugin }) {
    this.actions = actions
    this.selectablePlugin = selectablePlugin
  }

  get SelectedRows() {
    return this.selectablePlugin ? this.selectablePlugin.SelectedRows : []
  }

  render = () =>
    this.actions &&
    this.actions.map((action, index) =>
      this.renderAction({
        ...action,
        key: index
      })
    )

  renderAction = ({
    key,
    type,
    text,
    display,
    render,
    onClick,
    ...otherProps
  }) => {
    const params = {
      selectedRows: this.SelectedRows
    }

    if (display && display(params) === false) {
      return false
    }

    switch (type) {
      case 'button':
        return (
          <ActionItem key={key}>
            <ActionButton
              appearance="outline"
              size="small"
              {...otherProps}
              onClick={e => onClick && onClick(e, params)}
            >
              {text}
            </ActionButton>
          </ActionItem>
        )

      default:
        return <ActionItem key={key}>{render(params)}</ActionItem>
    }
  }
}
