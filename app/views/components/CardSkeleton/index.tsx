import React, { CSSProperties } from 'react'
import { Card, CardContent } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

interface Props {
  style?: CSSProperties
}

export default function CardSkeleton({ style }: Props) {
  return (
    <Card variant="outlined" style={{ height: '350px', ...style }}>
      <Skeleton animation="wave" variant="rect" height="60%" />
      <CardContent>
        <Skeleton
          variant="text"
          animation="wave"
          height="10%"
          style={{ marginBottom: 6 }}
        />
        <Skeleton variant="text" animation="wave" height="10%" width="80%" />
      </CardContent>
    </Card>
  )
}
