import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme } from '@material-ui/core'
import { mdiAccount } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { formatPhoneNumber } from 'utils/format'

const useStyles = makeStyles(
  (theme: Theme) => ({
    name: {
      marginBottom: theme.spacing(1),
      color: theme.palette.tertiary.light,
      [theme.breakpoints.up('sm')]: {
        ...theme.typography.h5
      }
    },
    photoWrapper: {
      width: 120,
      height: 120,
      marginRight: theme.spacing(2),
      backgroundColor: theme.palette.grey['500'],
      '& > img': {
        width: '100%',
        height: '100%'
      },
      [theme.breakpoints.up('sm')]: {
        width: 150,
        height: 150
      }
    },
    list: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    },
    listItem: {
      marginBottom: theme.spacing(1),
      wordBreak: 'break-all',
      color: theme.palette.tertiary.light,
      [theme.breakpoints.up('sm')]: {
        ...theme.typography.body1
      }
    }
  }),
  { name: 'AgentInfo' }
)

interface Props {
  name: string
  jobTitle: string
  email: string
  company: string
  tel: string
  image: string | null
}

function AgentInfo({
  name,
  jobTitle,
  email,
  company,
  tel,
  image
}: Partial<Props>) {
  const classes = useStyles()

  return (
    <Box display="flex">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={classes.photoWrapper}
      >
        {image ? (
          <img alt={name} src={image} />
        ) : (
          <SvgIcon
            path={mdiAccount}
            size={muiIconSizes.xxlarge}
            color="white"
          />
        )}
      </Box>

      <div>
        <ul className={classes.list}>
          <Typography
            variant="subtitle1"
            component="h3"
            className={classes.name}
          >
            {name}
          </Typography>
          {jobTitle ? (
            <Typography
              variant="caption"
              className={classes.listItem}
              component="li"
            >
              {jobTitle}
            </Typography>
          ) : null}

          {email ? (
            <Typography
              variant="caption"
              className={classes.listItem}
              component="li"
            >
              {email}
            </Typography>
          ) : null}

          {company ? (
            <Typography
              variant="caption"
              className={classes.listItem}
              component="li"
            >
              {company}
            </Typography>
          ) : null}

          {tel ? (
            <Typography
              variant="caption"
              className={classes.listItem}
              component="li"
            >
              {formatPhoneNumber(tel)}
            </Typography>
          ) : null}
        </ul>
      </div>
    </Box>
  )
}

export default AgentInfo
