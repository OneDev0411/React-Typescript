import { useState, ReactNode } from 'react'

import {
  ButtonBase,
  InputBase,
  NativeSelect,
  makeStyles,
  Theme
} from '@material-ui/core'
import { mdiContentCopy, mdiTrashCanOutline } from '@mdi/js'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'

import useNotify from '@app/hooks/use-notify'
import copy from '@app/utils/copy-text-to-clipboard'
import { SvgIcon, muiIconSizes } from '@app/views/components/SvgIcons'

import { UseAttributeDef } from '../hooks/use-attribute'

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
  attributeDef: IContactAttributeDef
  attribute?: IContactAttribute
  actions?: ReactNode
  onAdd?: UseAttributeDef['createAttribute']
  onDelete?: UseAttributeDef['deleteAttribute']
}
interface FormData {
  text: string
  label: string
}

export function Attribute({
  attributeDef,
  attribute,
  actions,
  onAdd,
  onDelete
}: Props) {
  const classes = useStyles()
  const notify = useNotify()
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      text: attribute?.text ?? '',
      label: attribute?.label ?? attributeDef.labels?.[0] ?? ''
    }
  })

  // console.log({ errors, isDirty, restData })

  const handleSaveAttribute: SubmitHandler<FormData> = async ({
    text,
    label
  }) => {
    console.log('handleSaveAttribute', { text, label })

    try {
      setIsSaving(true)

      if (!attribute && onAdd) {
        await onAdd({ text, label })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopyAttribute = () => {
    if (attribute?.text) {
      copy(attribute.text)
      notify({
        status: 'success',
        message: 'Copied!'
      })
    }
  }

  const handleDeleteAttribute = () => {
    if (attribute && onDelete) {
      onDelete(attribute.id)
    }
  }

  const renderActionButton = () => {
    if (isDirty) {
      return (
        <>
          <ButtonBase
            disableRipple
            type="submit"
            disabled={isSaving}
            className={classes.saveButton}
          >
            {isSaving ? 'Saving' : 'Save'}{' '}
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
        <div className={classes.actionButton} onClick={handleDeleteAttribute}>
          <SvgIcon path={mdiTrashCanOutline} size={muiIconSizes.small} />
        </div>
      </>
    )
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleSaveAttribute)}
      className={classes.container}
    >
      <div className={classes.valuesContainer}>
        <Controller
          name="text"
          control={control}
          rules={{
            validate: (value: string) =>
              !!value.trim() || 'This field is required.'
          }}
          render={props => {
            const error: string | undefined = errors.text?.message

            return (
              <InputBase
                {...props}
                margin="none"
                error={!!error}
                className={classes.value}
              />
            )
          }}
        />

        {attributeDef.labels && (
          <Controller
            name="label"
            control={control}
            rules={{
              validate: (value: string) =>
                !!value.trim() || 'This field is required.'
            }}
            render={props => (
              <NativeSelect {...props} id="label" className={classes.label}>
                {(attributeDef.labels ?? []).map(label => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </NativeSelect>
            )}
          />
        )}
      </div>
      <div className={classes.actionContainer}>{renderActionButton()}</div>
    </form>
  )
}
