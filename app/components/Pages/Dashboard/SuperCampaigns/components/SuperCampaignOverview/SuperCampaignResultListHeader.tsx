import { ReactNode } from 'react'

import { Box, BoxProps, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { useSuperCampaignListStyles } from './use-super-campaign-list-styles'

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
  const listStyles = useSuperCampaignListStyles()

  return (
    <div className={classNames(classes.root, listStyles.row)}>
      {headers.map((header, idx) => (
        <Box key={idx} width={header.width} textAlign={header.align}>
          {header.header}
        </Box>
      ))}
    </div>
  )
}

export default SuperCampaignResultListHeader
