import React from 'react'
import { connect } from 'react-redux'

import Drawer from 'components/OverlayDrawer'
import { Callout } from 'components/Callout'

import { setSelectedTask } from 'actions/deals'

import Header from './Header'
import Comments from './Comments'

function TaskView(props) {
  const { task } = props

  const onClose = () => {
    if (props.onClose) {
      return props.onClose()
    }

    props.setSelectedTask(null)
  }

  return (
    <Drawer open={props.isOpen} onClose={onClose} noFooter>
      <Drawer.Header
        style={{
          flexDirection: 'column',
          padding: '1rem 0 0 0'
        }}
      >
        <Header
          task={task}
          deal={props.deal}
          isBackOffice={props.isBackOffice}
          onClose={onClose}
        />
      </Drawer.Header>

      <Drawer.Body
        style={{
          padding: '2rem 1.5rem'
        }}
      >
        {props.deal.is_draft && (
          <Callout type="warn" style={{ margin: '1rem 0' }}>
            Once your deal goes live, admin can read the messages.
          </Callout>
        )}

        {task && task.task_type === 'YardSign' && (
          <Callout type="info" style={{ margin: '1rem 0' }}>
            Please add any special instructions for the yard sign in the
            comments.
          </Callout>
        )}

        <Comments
          deal={props.deal}
          task={task}
          isBackOffice={props.isBackOffice}
        />
      </Drawer.Body>
    </Drawer>
  )
}

export default connect(null, { setSelectedTask })(TaskView)
