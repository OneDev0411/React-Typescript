import { ReactNode } from 'react'

import { Box, Typography } from '@material-ui/core'

export interface ConnectedAccountsLayoutProps {
  className?: string
  title: string
  description: string
  action: ReactNode
  children: ReactNode
}

function ConnectedAccountsLayout({
  className,
  title,
  description,
  action,
  children
}: ConnectedAccountsLayoutProps) {
  return (
    <div className={className}>
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        </Box>
        {action}
      </Box>
      {children}
    </div>
  )
}

export default ConnectedAccountsLayout
