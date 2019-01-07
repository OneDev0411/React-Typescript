import React from 'react'
import { connect } from 'react-redux'

import Drawer from 'components/OverlayDrawer'

import { setSelectedTask } from 'actions/deals'

import Header from './Header'
import Comments from './Comments'
import DeleteTask from './DeleteTask'
import DraftBanner from './DraftBanner'

function TaskView(props) {
  const { task } = props
  const headerHeight = '7.3rem'

  const onClose = () => {
    if (props.onClose) {
      return props.onClose()
    }

    props.setSelectedTask(null)
  }

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
        <DraftBanner isDraftDeal={props.deal.is_draft} />

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
