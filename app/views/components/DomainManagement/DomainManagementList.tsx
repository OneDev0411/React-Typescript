import React from 'react'
import { Button, Box, makeStyles } from '@material-ui/core'

import { H4 } from 'components/Typography/headings'

import DomainManagementTitle from './DomainManagementTitle'
import DomainManagementListItem from './DomainManagementListItem'

export interface DomainManagementListProps {
  className: string
  websiteId: IWebsite['id']
  websiteTitle?: IWebsite['title']
  websiteHostnames: IWebsite['hostnames']
  onNewDomainClick: () => void
  onDomainDelete: (domainName: string) => void
}

const useStyles = makeStyles(
  theme => ({
    ul: {
      listStyle: 'none',
      padding: theme.spacing(0, 1),
      margin: theme.spacing(1, 0, 0, 0)
    }
  }),
  { name: 'DomainManagementList' }
)

function DomainManagementList({
  className,
  websiteHostnames,
  websiteTitle,
  onNewDomainClick,
  onDomainDelete,
  websiteId
}: DomainManagementListProps) {
  const classes = useStyles()

  return (
    <div className={className}>
      {websiteTitle && <DomainManagementTitle title={websiteTitle} />}
      <Box marginBottom={2}>
        <H4>Domains for This Site:</H4>
        <ul className={classes.ul}>
          {websiteHostnames?.map(hostname => (
            <DomainManagementListItem
              key={hostname}
              hostname={hostname}
              websiteId={websiteId}
              onDelete={onDomainDelete}
            />
          ))}
        </ul>
      </Box>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        onClick={onNewDomainClick}
      >
        Add Another Domain
      </Button>
    </div>
  )
}

export default DomainManagementList
