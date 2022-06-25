import { Box, makeStyles, Theme, Typography, Avatar } from '@material-ui/core'
import { mdiDatabaseOutline, mdiHomeOutline } from '@mdi/js'

import { getStatusColorClass } from '@app/utils/listing'

import { muiIconSizes, SvgIcon } from '../SvgIcons'

const useStyles = makeStyles(
  (theme: Theme) => ({
    subtitle: {
      color: theme.palette.grey['500']
    },
    status: {
      color: '#fff',
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(0.5, 1)
    }
  }),
  {
    name: 'DealPropertyPicker-RowItem'
  }
)

interface Props {
  avatarUrl: string
  title: string
  subtitle: Nullable<string>
  status: IListingStatus
  mlsName: Nullable<string>
}

export function RowItem({
  avatarUrl,
  title,
  subtitle,
  status,
  mlsName
}: Props) {
  const classes = useStyles()

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <Box display="flex" alignItems="center">
        <Avatar src={avatarUrl}>
          <SvgIcon path={mdiHomeOutline} />
        </Avatar>

        <Box ml={2}>
          <Typography variant="body1">{title}</Typography>
          {subtitle && (
            <Typography className={classes.subtitle} variant="body2">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        justifyContent="center"
      >
        <Typography
          className={classes.status}
          style={{
            backgroundColor: getStatusColorClass(status)
          }}
          variant="caption"
        >
          {status}
        </Typography>

        {mlsName && (
          <Box display="flex" alignItems="center" mt={0.5}>
            <SvgIcon path={mdiDatabaseOutline} size={muiIconSizes.small} />{' '}
            <Typography variant="caption">{mlsName}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
