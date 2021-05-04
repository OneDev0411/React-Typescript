import {
  Box,
  Chip,
  IconButton,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'
import { mdiCalendar, mdiCardsOutline, mdiDotsVertical } from '@mdi/js'
import cn from 'classnames'

import { Avatar } from 'components/Avatar'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.grey['50'],
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      marginRight: theme.spacing(1.5),
      width: '360px',
      height: '100%',
      overflow: 'auto'
    },
    head: {
      position: 'sticky',
      top: 0,
      backgroundColor: theme.palette.grey['50'],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(2),
      zIndex: 1
    },
    body: {
      flexGrow: 1
    },
    item: {
      backgroundColor: '#fff',
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      margin: theme.spacing(0.5),
      padding: theme.spacing(1.5),
      '&:hover': {
        backgroundColor: theme.palette.grey['50'],
        cursor: 'move'
      }
    },
    name: {
      marginLeft: theme.spacing(1),
      ...theme.typography.body3
    },
    lightColor: {
      color: theme.palette.grey['500']
    },
    tag: {
      backgroundColor: '#fff',
      border: `1px solid ${theme.palette.divider}`,
      margin: theme.spacing(0, 1, 1, 0)
    },
    noTags: {
      backgroundColor: '#fff'
    }
  }),
  {
    name: 'Board-Column'
  }
)

interface Props {
  title: string
  list: IContact[]
}

export function BoardColumn({ title, list }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.head}>
        <Chip label={title} size="small" />

        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          flexGrow={1}
        >
          <Box display="flex" alignItems="center" mr={1}>
            <SvgIcon path={mdiCardsOutline} />
            <Box ml={0.5}>
              <Typography variant="subtitle1">0</Typography>
            </Box>
          </Box>

          <IconButton size="small">
            <SvgIcon path={mdiDotsVertical} />
          </IconButton>
        </Box>
      </div>

      <Box className={classes.body}>
        {list.map(contact => (
          <Box key={contact.id} className={classes.item}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center">
                <Avatar contact={contact} size="small" />
                <Typography className={classes.name}>
                  <TextMiddleTruncate
                    text={contact.display_name}
                    maxLength={30}
                  />
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <SvgIcon
                  path={mdiCalendar}
                  className={classes.lightColor}
                  size={muiIconSizes.xsmall}
                />
                <Typography variant="caption" className={classes.lightColor}>
                  12 hours ago
                </Typography>
              </Box>
            </Box>

            <Box mt={2}>
              {(contact.tags || []).length > 0 ? (
                contact.tags?.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    className={classes.tag}
                  />
                ))
              ) : (
                <Chip
                  className={cn(classes.noTags, classes.lightColor)}
                  label="No Tags"
                  size="small"
                />
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </div>
  )
}
