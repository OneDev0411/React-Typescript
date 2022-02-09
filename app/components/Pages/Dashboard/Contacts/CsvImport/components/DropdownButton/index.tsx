import {
  Box,
  IconButton,
  makeStyles,
  Theme,
  Tooltip,
  Typography
} from '@material-ui/core'
import { mdiChevronDown, mdiChevronUp, mdiClose } from '@mdi/js'
import cn from 'classnames'

import { RenderToggleButtonProps } from '@app/views/components/BaseDropdown'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(0.5, 2),
      borderRadius: theme.shape.borderRadius
    },
    title: {
      userSelect: 'none',
      '&.placeholder': {
        color: theme.palette.grey[800]
      },
      '&:hover': {
        cursor: 'pointer',
        opacity: 0.8
      }
    }
  }),
  {
    name: 'ImportCsv-BaseDropdownButton'
  }
)

interface Props {
  buttonProps: RenderToggleButtonProps
  label: string
  hasValue: boolean
  onRemove: () => void
}

export function DropdownButton({
  buttonProps: { onClick, isActive, ...props },
  label,
  hasValue,
  onRemove
}: Props) {
  const classes = useStyles()

  return (
    <div className={classes.button} {...props}>
      <Box flexGrow={1}>
        <Typography
          className={cn(classes.title, {
            placeholder: !hasValue
          })}
          variant="body1"
          onClick={onClick}
        >
          {label}
        </Typography>
      </Box>

      <div>
        {hasValue && (
          <Tooltip title="Un-map">
            <IconButton size="small" onClick={onRemove}>
              <SvgIcon path={mdiClose} size={muiIconSizes.medium} />
            </IconButton>
          </Tooltip>
        )}

        <IconButton size="small" onClick={onClick}>
          <SvgIcon
            path={isActive ? mdiChevronUp : mdiChevronDown}
            size={muiIconSizes.medium}
          />
        </IconButton>
      </div>
    </div>
  )
}
