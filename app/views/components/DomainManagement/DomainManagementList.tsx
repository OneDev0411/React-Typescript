import React from 'react'
import {
  Box,
  Typography,
  Link,
  makeStyles,
  IconButton
} from '@material-ui/core'
import { Close } from '@material-ui/icons'

import { H4 } from 'components/Typography/headings'
import { isWebsiteOnSubdomain, generateWebsiteUrl } from 'utils/website'

export interface DomainManagementListProps {
  websiteId: IWebsite['id']
  websiteHostnames: IWebsite['hostnames']
}

const useStyles = makeStyles(
  theme => ({
    ul: {
      listStyle: 'none',
      padding: theme.spacing(0, 1),
      margin: theme.spacing(1, 0, 0, 0)
    },
    li: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      height: theme.spacing(5.5),
      borderRadius: theme.shape.borderRadius,
      transition: theme.transitions.create('background-color'),
      '&:hover': { backgroundColor: theme.palette.grey[100] },
      '&:hover $action': { opacity: 1 }
    },
    action: {
      opacity: 0,
      transition: theme.transitions.create('opacity'),
      marginLeft: theme.spacing(1),
      '& svg': {
        color: theme.palette.text.secondary,
        fontSize: 22
      }
    }
  }),
  { name: 'DomainManagementList' }
)

function DomainManagementList({ websiteHostnames }: DomainManagementListProps) {
  const classes = useStyles()

  // @TODO: implement the delete host API call here
  const handleDeleteHostname = (hostname: string) => {}

  return (
    <Box marginBottom={2}>
      <H4>Domain List:</H4>
      <ul className={classes.ul}>
        {websiteHostnames.map(hostname => (
          <li className={classes.li} key={hostname}>
            <Typography variant="body1" noWrap>
              <Link href={generateWebsiteUrl(hostname)} target="_blank">
                {hostname}
              </Link>
            </Typography>
            {!isWebsiteOnSubdomain(hostname) && (
              <IconButton
                className={classes.action}
                size="small"
                color="inherit"
                onClick={() => handleDeleteHostname(hostname)}
              >
                <Close />
              </IconButton>
            )}
          </li>
        ))}
      </ul>
    </Box>
  )
}

export default DomainManagementList
