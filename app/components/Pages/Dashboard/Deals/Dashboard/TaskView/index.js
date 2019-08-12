import React from 'react'
import { connect } from 'react-redux'

import Drawer from 'components/OverlayDrawer'

import { setSelectedTask } from 'actions/deals'

import Header from './Header'
import Comments from './Comments'
import DraftBanner from './DraftBanner'

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
        <Header task={task} deal={props.deal} onClose={onClose} />
      </Drawer.Header>

      <Drawer.Body
        style={{
          padding: '2rem 1.5rem'
        }}
      >
        <DraftBanner isDraftDeal={props.deal.is_draft} />

        <Comments
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
