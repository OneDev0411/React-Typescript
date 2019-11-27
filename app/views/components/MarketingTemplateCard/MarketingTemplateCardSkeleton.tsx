import * as React from 'react'
import { Skeleton } from '@material-ui/lab'
import { createStyles, makeStyles } from '@material-ui/core'

import { ClassesProps } from 'utils/ts-utils'

interface Props {
  height?: number | string
}

const styles = () =>
  createStyles({
    root: {
      marginBottom: '3rem'
    }
  })
const useStyles = makeStyles(styles, { name: 'MarketingTemplateCardSkeleton' })

export function MarketingTemplateCardSkeleton({
  /**
   * We can add some randomness for height to make it more similar to real
   * templates
   */
  height = 300,
  ...props
}: Props & ClassesProps<typeof styles>) {
  const classes = useStyles(props)

  return (
    <Skeleton
      variant="rect"
      height={height}
      width="100%"
      className={classes.root}
    />
  )
}
