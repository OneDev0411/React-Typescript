import React from 'react'
import { Card, CardContent, CardActions, Typography } from '@material-ui/core'

interface ShowingCardProps {
  className?: string
}

function ShowingCard({ className }: ShowingCardProps) {
  return (
    <Card variant="outlined" className={className}>
      <CardContent>
        <Typography>showing card details</Typography>
      </CardContent>
      <CardActions>actions area</CardActions>
    </Card>
  )
}

export default ShowingCard
