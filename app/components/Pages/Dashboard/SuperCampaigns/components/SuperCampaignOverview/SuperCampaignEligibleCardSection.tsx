import { ReactNode } from 'react'

import { Box, Typography } from '@material-ui/core'

interface SuperCampaignEligibleCardSectionProps {
  subject: string
  children: ReactNode
}

function SuperCampaignEligibleCardSection({
  subject,
  children
}: SuperCampaignEligibleCardSectionProps) {
  return (
    <Box display="flex" alignItems="center">
      <Box flexGrow={0} flexShrink={0} mr={1}>
        <Typography variant="body2">{subject}:</Typography>
      </Box>
      <Box flexGrow={1} flexShrink={1}>
        {children}
      </Box>
    </Box>
  )
}

export default SuperCampaignEligibleCardSection
