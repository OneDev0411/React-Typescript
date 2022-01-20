import { createStyles, makeStyles, Theme, Tooltip } from '@material-ui/core'
import timeago from 'timeago.js'

import CellContainer from './CellContainer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    noTouch: {
      ...theme.typography.body2,
      lineHeight: `${theme.spacing(3)}px`,
      color: theme.palette.grey[700]
    },
    lastTouchValue: {
      ...theme.typography.body2,
      lineHeight: `${theme.spacing(3)}px`,
      color: theme.palette.grey[700]
    }
  })
)

//-----

interface Props {
  contact: IContact
  onSave?: (e: any) => void
}

const LastTouchCell = ({ contact }: Props) => {
  const classes = useStyles()

  const renderCellContent = () => {
    const { last_touch: lastTouch, next_touch: nextTouch } = contact

    if (!lastTouch) {
      return <span className={classes.noTouch}>No Touches</span>
    }

    const formattedLastTouch = timeago().format(lastTouch * 1000)
    // const formattedLastTouch = moment(lastTouch).format('ll')

    const content = (
      <div className={classes.lastTouchValue}>{formattedLastTouch}</div>
    )

    if (nextTouch) {
      return (
        <Tooltip
          title={
            <span>
              You wanted to be in touch
              <br />
              every {Math.round((nextTouch - lastTouch) / 86400)} days.
            </span>
          }
        >
          {content}
        </Tooltip>
      )
    }

    return content
  }

  return <CellContainer renderCellContent={renderCellContent} />
}

export default LastTouchCell
