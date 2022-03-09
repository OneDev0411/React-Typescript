import {
  Box,
  Divider,
  Theme,
  Tooltip,
  Typography,
  useTheme
} from '@material-ui/core'
import { mdiInformationOutline } from '@mdi/js'
import { useSelector } from 'react-redux'

import { selectUser } from '@app/selectors/user'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { TeamContactSelect } from '@app/views/components/TeamContact/TeamContactSelect'

import { useImportCsv } from '../../hooks/use-import-csv'

interface Props {
  onSelect: (user: IUser) => void
}

export function Owner({ onSelect }: Props) {
  const { owner } = useImportCsv()
  const user = useSelector(selectUser)
  const theme = useTheme<Theme>()

  return (
    <Box textAlign="center">
      <Typography variant="subtitle1">Importing To</Typography>

      <Box display="flex" justifyContent="center" alignItems="center" my={2}>
        <Typography variant="body1">{owner?.display_name}</Typography>

        <Box ml={1}>
          <Tooltip title="Not the team you want to import these contacts into? No worries. Go to your team switcher to change your team and then try importing again.">
            <span>
              <SvgIcon
                path={mdiInformationOutline}
                color={theme.palette.primary.main}
              />
            </span>
          </Tooltip>
        </Box>
      </Box>

      <Divider />

      <Box my={2}>
        <Typography variant="body2">Contact Owner</Typography>
      </Box>
      <TeamContactSelect
        // @ts-ignore
        upsideDown
        fullWidth
        user={user}
        owner={owner!}
        onSelect={({ value }) => onSelect(value)}
      />
    </Box>
  )
}
