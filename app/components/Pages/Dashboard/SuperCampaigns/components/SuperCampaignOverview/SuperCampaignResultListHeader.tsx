import { ReactNode } from 'react'

import { Box, BoxProps, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      height: theme.spacing(5)
    }
  }),
  { name: 'SuperCampaignResultListHeader' }
)

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
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {headers.map((header, idx) => (
        <Box key={idx} width={header.width} textAlign={header.align}>
          {header.header}
        </Box>
      ))}
    </div>
  )
}

export default SuperCampaignResultListHeader
