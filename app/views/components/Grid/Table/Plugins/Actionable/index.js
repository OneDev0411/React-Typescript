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

  get EntireModeEnabled() {
    return this.selectablePlugin
      ? this.selectablePlugin.isEntireRowsSelected()
      : false
  }

  get SelectedRows() {
    return this.selectablePlugin ? this.selectablePlugin.SelectedRows : []
  }

  get ExcludedRows() {
    return this.selectablePlugin ? this.selectablePlugin.ExcludedRows : []
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
      entireMode: this.EntireModeEnabled,
      selectedRows: this.SelectedRows,
      excludedRows: this.ExcludedRows
    }

    if (display && display(params) === false) {
      return false
    }

    if (this.selectablePlugin) {
      params.resetSelectedRows = this.selectablePlugin.resetSelectedItems
      params.totalRowsCount = this.selectablePlugin.totalCount
    }

    switch (type) {
      case 'button':
        return (
          <ActionItem key={key}>
            <ActionButton
              appearance="outline"
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
