import { useState } from 'react'

import {
  IconButton,
  makeStyles,
  TextField,
  Theme,
  Tooltip,
  Typography
} from '@material-ui/core'
import { mdiBellOutline, mdiCheck } from '@mdi/js'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import { MaskedInput } from 'components/MaskedInput'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  contactTouchFreq: Nullable<number>
  onChangeTouchFreq(newValue: Nullable<number>): void
}

const mask = createNumberMask({
  prefix: '',
  includeThousandsSeparator: false,
  allowNegative: false,
  allowLeadingZeroes: false,
  allowDecimal: false
})

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 48,
      minWidth: 350,
      padding: theme.spacing(1)
    },
    icon: {
      color: theme.palette.grey[700]
    },
    label: {
      color: theme.palette.text.primary,
      marginRight: theme.spacing(1)
    },
    input: {
      width: 48
    },
    inputSuffix: {
      color: theme.palette.text.primary,
      marginLeft: theme.spacing(1)
    },
    iconButton: {
      marginLeft: theme.spacing(2)
    },
    iconButtonSvg: {
      color: theme.palette.primary.main
    }
  }),
  { name: 'ManageRelationshipCustomItem' }
)

export function ManageRelationshipCustomItem({
  contactTouchFreq,
  onChangeTouchFreq
}: Props) {
  const classes = useStyles()
  const [inputValue, setInputValue] = useState(contactTouchFreq || '')

  const handleChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = e.target.value
    const value = maskedValue ? parseFloat(maskedValue.replace(/\,/gi, '')) : ''

    setInputValue(value.toString())
  }

  const onConfirm = () => {
    onChangeTouchFreq(
      inputValue && !Number.isNaN(inputValue) ? Number(inputValue) : null
    )
  }

  return (
    <div className={classes.container}>
      <SvgIcon
        path={mdiBellOutline}
        className={classes.icon}
        size={muiIconSizes.medium}
        rightMargined
        leftMargined
      />
      <Typography variant="body2" className={classes.label}>
        Remind to touch every
      </Typography>

      <TextField
        className={classes.input}
        autoFocus
        variant="standard"
        size="small"
        InputProps={{
          inputProps: {
            'aria-label': 'Remind to touch every',
            mask
          },
          inputComponent: mask ? MaskedInput : undefined,
          value: inputValue,
          onChange: handleChangeInputValue
        }}
      />

      <Typography variant="body2" className={classes.inputSuffix}>
        Days
      </Typography>

      <Tooltip title="Save">
        <IconButton
          role="button"
          size="small"
          onClick={onConfirm}
          color="primary"
          className={classes.iconButton}
        >
          <SvgIcon
            path={mdiCheck}
            className={classes.iconButtonSvg}
            size={muiIconSizes.medium}
          />
        </IconButton>
      </Tooltip>
    </div>
  )
}
