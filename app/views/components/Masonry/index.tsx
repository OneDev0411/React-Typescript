import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import CSSMasonry from 'react-masonry-css'

const useStyles = makeStyles(
  theme => ({
    masonryGrid: {
      display: 'flex'
    },
    masonryColumn: {
      margin: theme.spacing(1)
    }
  }),
  {
    name: 'Masonry'
  }
)

interface Props {
  children: React.ReactNode
}

export default function Masonry({ children }: Props) {
  const classes = useStyles()
  const theme = useTheme()

  const breakpointCols = {
    default: 4,
    [theme.breakpoints.values.xl]: 4,
    [theme.breakpoints.values.lg]: 3,
    [theme.breakpoints.values.md]: 2,
    [theme.breakpoints.values.sm]: 1,
    [theme.breakpoints.values.xs]: 1
  }

  return (
    <CSSMasonry
      breakpointCols={breakpointCols}
      className={classes.masonryGrid}
      columnClassName={classes.masonryColumn}
    >
      {children}
    </CSSMasonry>
  )
}
