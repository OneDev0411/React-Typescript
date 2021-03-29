import React, { ReactNode } from 'react'
import { Typography, Box, Grid } from '@material-ui/core'

interface ShowingPropertyFormSectionProps {
  marginTop?: number
  title: string
  children: ReactNode
}

function ShowingPropertyFormSection({
  marginTop = 0,
  title,
  children
}: ShowingPropertyFormSectionProps) {
  return (
    <Box mt={marginTop}>
      <Typography variant="h6">{title}</Typography>
      <Box mt={2}>
        <Grid container spacing={1}>
          {children}
        </Grid>
      </Box>
    </Box>
  )
}

export default ShowingPropertyFormSection
