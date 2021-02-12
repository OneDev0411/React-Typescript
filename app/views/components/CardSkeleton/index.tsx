import React, { CSSProperties } from 'react'
import { Card, CardContent } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

interface Props {
  style?: CSSProperties
}

export default function CardSkeleton({ style }: Props) {
  return (
    <Card variant="outlined" style={{ height: '350px', ...style }}>
      <Skeleton animation="wave" variant="rect" height={200} />
      <CardContent>
        <Skeleton
          variant="text"
          animation="wave"
          height={25}
          style={{ marginBottom: 6 }}
        />
        <Skeleton variant="text" animation="wave" height={20} width="80%" />
      </CardContent>
    </Card>
  )
}
