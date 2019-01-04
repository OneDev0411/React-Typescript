import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import Drawer from 'components/OverlayDrawer'

import { selectDealTasks } from 'reducers/deals/tasks'

import ActionButton from 'components/Button/ActionButton'

import { normalizeAttachment } from '../helpers/normalize-attachment'

import Document from './Document'

export class AttachmentsSelect extends React.Component {
  state = {
    selectedItems: this.props.defaultSelectedItems || {}
  }

  toggleSelectRow = document => {
    let newState = {}

    const item = normalizeAttachment(document)

    if (this.state.selectedItems[item.id]) {
      newState = _.omit(this.state.selectedItems, row => row.id === item.id)
    } else {
      newState = {
        ...this.state.selectedItems,
        [item.id]: item
      }
    }

    this.setState({ selectedItems: newState })
  }

  handleApply = () =>
    this.props.onChangeSelectedDocuments(this.state.selectedItems)

  render() {
    const { props } = this

    return (
      <Drawer isOpen onClose={props.onClose}>
        <Drawer.Header title="Select Documents" />
        <Drawer.Body>
          {props.tasks &&
            props.tasks.map(task => (
              <Document
                key={task.id}
                task={task}
                onToggleItem={this.toggleSelectRow}
                selectedItems={this.state.selectedItems}
              />
            ))}

          {props.deal.files &&
            props.deal.files
              .filter(file => file.mime === 'application/pdf')
              .map(file => (
                <Document
                  key={file.id}
                  deal={props.deal}
                  task={null}
                  stashFile={file}
                />
              ))}
        </Drawer.Body>

        <Drawer.Footer style={{ flexDirection: 'row-reverse' }}>
          <ActionButton type="button" onClick={this.handleApply}>
            Next
          </ActionButton>
        </Drawer.Footer>
      </Drawer>
    )
  }
}

function mapStateToProps({ deals }, props) {
  return {
    tasks: selectDealTasks(props.deal, deals.checklists, deals.tasks)
  }
}

export default connect(mapStateToProps)(AttachmentsSelect)
