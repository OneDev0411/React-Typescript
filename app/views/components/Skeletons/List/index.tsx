import * as React from 'react'
import { Skeleton } from '@material-ui/lab'
import {
  createStyles,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme
} from '@material-ui/core'

import { ClassesProps } from 'utils/ts-utils'

interface Props {
  /**
   * whether list items have avatar/icon or not
   */
  avatar?: boolean
  /**
   * whether list items are two lines or single line
   */
  twoLines?: boolean
  /**
   * whether list items are dense or not. Will affect the list item padding
   * and also the height of skeletons for list contents
   */
  dense?: boolean
  /**
   * whether list items have divider or not
   */
  divider?: boolean
  /**
   * number of list items to show. Defaults to 3
   */
  numItems?: number
}

const styles = (theme: Theme) =>
  createStyles({
    textSkeleton: {
      marginTop: '.5em',
      marginBottom: '.5em'
    }
  })
const useStyles = makeStyles(styles, { name: 'ListSkeleton' })

/**
 * A high level skeleton component to be used in place of lists.
 */
export function ListSkeleton({
  avatar = false,
  twoLines = false,
  dense = false,
  numItems = 3,
  divider = false,
  ...props
}: Props & ClassesProps<typeof styles>) {
  const skeletonHeight = dense ? '.85em' : '1.2em'
  const avatarDiameter = dense ? 36 : 40

  const classes = useStyles(props)

  return (
    <>
      {new Array(numItems).fill(null).map((_, index) => (
        <ListItem
          dense={dense}
          divider={divider}
          ContainerComponent="div"
          key={index}
        >
          {avatar && (
            <ListItemIcon>
              <Skeleton
                variant="circle"
                width={avatarDiameter}
                height={avatarDiameter}
              />
            </ListItemIcon>
          )}
          <ListItemText
            primary={
              <Skeleton
                className={classes.textSkeleton}
                height={skeletonHeight}
                width={twoLines ? '30%' : undefined}
              />
            }
            secondary={
              twoLines && (
                <Skeleton
                  height={skeletonHeight}
                  width="90%"
                  className={classes.textSkeleton}
                />
              )
            }
          />
        </ListItem>
      ))}
    </>
  )
}
