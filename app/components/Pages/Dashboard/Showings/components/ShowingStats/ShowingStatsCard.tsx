import { Box, Card, Typography } from '@material-ui/core'

interface ShowingStatsCardProps {
  count: number
  label: string
}

function ShowingStatsCard({ count, label }: ShowingStatsCardProps) {
  return (
    <Card variant="outlined">
      <Box px={3} pt={1} pb={2}>
        <Typography variant="h3">{count}</Typography>
        <Typography variant="body1">{label}</Typography>
      </Box>
    </Card>
  )
}

export default ShowingStatsCard
