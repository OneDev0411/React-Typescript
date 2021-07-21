import React from 'react'

import { Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import { PageTabs, Tab } from 'components/PageTabs'

export const TabMarketingSkeleton = () => {
  return (
    <PageTabs
      tabs={[1, 2, 3, 4, 5, 6].map(i => (
        <Tab
          key={i}
          label={
            <Typography key={i} variant="body1">
              <Skeleton width={90} />
            </Typography>
          }
        />
      ))}
    />
  )
}
