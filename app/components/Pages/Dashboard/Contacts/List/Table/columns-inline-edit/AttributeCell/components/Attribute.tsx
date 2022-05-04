import { ReactNode } from 'react'

import {
  ButtonBase,
  InputBase,
  NativeSelect,
  makeStyles,
  Theme
} from '@material-ui/core'
import { mdiContentCopy, mdiTrashCanOutline } from '@mdi/js'
import { useForm, Controller } from 'react-hook-form'

import { SvgIcon, muiIconSizes } from '@app/views/components/SvgIcons'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '100%',
      display: 'flex',
      padding: theme.spacing(1, 2),
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    valuesContainer: {
      display: 'flex',
      paddingRight: theme.spacing(1),
      alignItems: 'center',
      flexGrow: 1
    },
    value: {
      // background: 'red',
      flexGrow: 1
    },
    label: {
      // background: 'blue'
    },
    actionContainer: {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.action.disabled
    },
    customActionContainer: {
      marginRight: theme.spacing(0.5)
    },
    saveButton: {
      marginRight: theme.spacing(0.5),
      color: theme.palette.primary.main,
      ...theme.typography.body2
    },
    actionButton: {
      cursor: 'pointer',
      '&:not(:last-child)': {
        marginRight: theme.spacing(0.5)
      }
    }
  }),
  {
    name: 'AttributeCell'
  }
)

interface Props {
  labels: string[]
  values: {
    value: string
    label: string
  }
  actions?: ReactNode
  onAdd: () => void
  onDelete: () => void
}
interface FormData {
  value: string
  label: string
}

export function Attribute({ values, actions }: Partial<Props>) {
  const classes = useStyles()
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isDirty, ...restData }
  } = useForm<FormData>({
    defaultValues: {
      value: values?.value ?? '',
      label: values?.label ?? ''
    }
  })

  console.log({ errors, isDirty, restData })

  const handleSaveAttribute = v => {
    console.log('handleSaveAttribute', { v })
  }

  const handleCopyAttribute = () => {
    console.log('handleCopyAttribute')
  }
  const handleRemoveAttribute = () => {
    console.log('handleRemoveAttribute')
  }

  const renderActionButton = () => {
    if (isDirty) {
      return (
        <>
          <ButtonBase
            disableRipple
            type="submit"
            className={classes.saveButton}
          >
            Save
          </ButtonBase>
          <ButtonBase disableRipple onClick={() => reset()}>
            Discard
          </ButtonBase>
        </>
      )
    }

    return (
      <>
        {actions && (
          <div className={classes.customActionContainer}>{actions}</div>
        )}
        <div className={classes.actionButton} onClick={handleCopyAttribute}>
          <SvgIcon path={mdiContentCopy} size={muiIconSizes.small} />
        </div>
        <div className={classes.actionButton} onClick={handleRemoveAttribute}>
          <SvgIcon path={mdiTrashCanOutline} size={muiIconSizes.small} />
        </div>
      </>
    )
  }

  return (
    <div className={classes.container}>
      <form
        onSubmit={handleSubmit(handleSaveAttribute)}
        className={classes.valuesContainer}
        noValidate
      >
        <Controller
          name="value"
          control={control}
          rules={{
            validate: (value: string) =>
              !!value.trim() || 'This field is required.'
          }}
          render={props => {
            const error: string | undefined = errors.value?.message

            return (
              <InputBase
                {...props}
                name="value"
                margin="none"
                error={!!error}
                className={classes.value}
              />
            )
          }}
        />
        <Controller
          name="label"
          control={control}
          rules={{
            validate: (value: string) =>
              !!value.trim() || 'This field is required.'
          }}
          render={props => (
            <NativeSelect {...props} id="label" className={classes.label}>
              <option value="22">test</option>
              <option value="33">test 2</option>
            </NativeSelect>
          )}
        />
      </form>
      <div className={classes.actionContainer}>{renderActionButton()}</div>
    </div>
  )
}
