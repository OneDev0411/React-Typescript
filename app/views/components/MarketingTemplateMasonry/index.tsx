import Masonry from 'react-masonry-css'
import React, { ComponentProps } from 'react'

import { createStyles, makeStyles, Theme } from '@material-ui/core'

import classNames from 'classnames'

import { ClassesProps } from 'utils/ts-utils'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    column: {
      padding: theme.spacing(0, 2),
      backgroundClip: 'padding-box' // just copied from old code
    }
  })
const useMarketingTemplateMasonryStyles = makeStyles(styles, {
  name: 'MarketingTemplateMasonry'
})

export function MarketingTemplateMasonry({
  classes: inputClasses,
  ...props
}: Omit<Omit<ComponentProps<typeof Masonry>, 'columnClassName'>, 'ref'> &
  ClassesProps<typeof styles>) {
  const classes = useMarketingTemplateMasonryStyles({ classes: inputClasses })

  return (
    <Masonry
      {...props}
      className={classNames(props.className, classes.root)}
      columnClassName={classes.column}
    />
  )
}
