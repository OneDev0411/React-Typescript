import { Box, makeStyles, Theme, Typography } from '@material-ui/core'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { HeaderColumn } from '../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    title: {
      color: theme.palette.grey[700],
      textAlign: 'left'
    },
    icon: {
      color: theme.palette.grey[500]
    }
  }),
  { name: 'Header' }
)

interface Props {
  columns: HeaderColumn[]
}

export function Header({ columns }: Props) {
  const classes = useStyles()

  return (
    <Box display="flex" mb={2} pr={2}>
      {columns.map((item, index) => (
        <Box
          key={index}
          display="flex"
          width={item.width}
          justifyContent={item.textAlign}
        >
          <SvgIcon
            className={classes.icon}
            path={item.icon}
            size={muiIconSizes.small}
          />
          <Box ml={0.75}>
            <Typography variant="body2" className={classes.title}>
              {item.title}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
