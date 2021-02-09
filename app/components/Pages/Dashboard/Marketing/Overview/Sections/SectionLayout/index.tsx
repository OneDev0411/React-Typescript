import React, { ReactNode } from 'react'
import { Grid, Typography, GridProps } from '@material-ui/core'

interface Props {
  title: string
  actionNode: ReactNode
  children: ReactNode
  gridProps?: GridProps
}

export default function SectionLayout({
  title,
  actionNode,
  children,
  gridProps = {}
}: Props) {
  return (
    <Grid container item spacing={2} direction="column" {...gridProps}>
      <Grid container item spacing={2} alignItems="center" direction="row">
        <Grid item>
          <Typography variant="h5">{title}</Typography>
        </Grid>
        <Grid item>{actionNode}</Grid>
      </Grid>
      <Grid container item spacing={1} direction="row">
        {children}
      </Grid>
    </Grid>
  )
}
