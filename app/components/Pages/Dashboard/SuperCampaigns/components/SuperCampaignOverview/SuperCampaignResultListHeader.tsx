import { ReactNode } from 'react'

import { Box, BoxProps } from '@material-ui/core'

export interface ListHeader {
  width?: string
  align?: BoxProps['textAlign']
  header: ReactNode
}

interface SuperCampaignResultListHeaderProps {
  headers: ListHeader[]
}

function SuperCampaignResultListHeader({
  headers
}: SuperCampaignResultListHeaderProps) {
  return (
    <Box display="flex" alignItems="center" height="40px">
      {headers.map((header, idx) => (
        <Box key={idx} width={header.width} textAlign={header.align}>
          {header.header}
        </Box>
      ))}
    </Box>
  )
}

export default SuperCampaignResultListHeader
