import { useEffect, useRef, useState } from 'react'

import { Box, makeStyles } from '@material-ui/core'
import { connect } from 'react-redux'

import { setSelectedTask } from 'actions/deals'
import { Callout } from 'components/Callout'
import Drawer from 'components/OverlayDrawer'

import Comments from './Comments'
import Header from './Header'

const useStyles = makeStyles(
  theme => ({
    drawerBody: {
      padding: 0,
      overflow: 'hidden'
    },
    bodyContainer: {
      padding: theme.spacing(4, 3),
      height: '100%',
      overflow: 'auto'
    }
  }),
  {
    name: 'Deals-TaskView'
  }
)

function TaskView(props) {
  const { task } = props
  const taskId = task?.id

  const classes = useStyles()
  const bodyContainerRef = useRef()

  const [isCommentsLoaded, setIsCommentsLoaded] = useState(false)

  const onClose = () => {
    setIsCommentsLoaded(false)

    if (props.onClose) {
      return props.onClose()
    }

    props.setSelectedTask(null)
  }

  const scrollToEnd = () => {
    const element = bodyContainerRef.current

    if (element) {
      element.scroll({
        top: element.scrollHeight
      })
    }
  }

  useEffect(() => {
    if (!taskId || !isCommentsLoaded) {
      return
    }

    scrollToEnd()
  }, [taskId, isCommentsLoaded])

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

      <Drawer.Body className={classes.drawerBody}>
        <Box className={classes.bodyContainer} ref={bodyContainerRef}>
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
            onLoadComments={() => setIsCommentsLoaded(true)}
            onSendMessage={scrollToEnd}
          />
        </Box>
      </Drawer.Body>
    </Drawer>
  )
}

export default connect(null, { setSelectedTask })(TaskView)
