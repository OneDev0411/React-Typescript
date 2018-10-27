import React from 'react'
import { connect } from 'react-redux'

import Drawer from 'components/OverlayDrawer'

import Header from './Header'
import Comments from './Comments'
import DeleteTask from './DeleteTask'

import { setSelectedTask } from 'actions/deals'

function TaskView(props) {
  const { task } = props
  const onClose = () => props.setSelectedTask(null)

  const headerHeight = '7.3rem'

  return (
    <Drawer isOpen={props.isOpen} onClose={onClose} noFooter>
      <Drawer.Header
        style={{
          flexDirection: 'column',
          padding: '1.25rem 0',
          height: headerHeight
        }}
        render={() => (
          <Header task={task} deal={props.deal} onClose={onClose} />
        )}
      />

      <Drawer.Body
        style={{
          paddingTop: headerHeight
        }}
      >
        <Comments
          deal={props.deal}
          task={task}
          isBackOffice={props.isBackOffice}
        />

        <DeleteTask
          deal={props.deal}
          task={task}
          isBackOffice={props.isBackOffice}
        />
      </Drawer.Body>
    </Drawer>
  )
}

export default connect(
  null,
  { setSelectedTask }
)(TaskView)
