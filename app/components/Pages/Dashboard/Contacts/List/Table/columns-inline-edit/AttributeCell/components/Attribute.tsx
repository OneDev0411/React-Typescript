import { useState, ReactNode } from 'react'

import {
  ButtonBase,
  InputBase,
  NativeSelect,
  makeStyles,
  Theme
} from '@material-ui/core'
import { mdiLoading, mdiContentCopy, mdiTrashCanOutline } from '@mdi/js'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'

import useNotify from '@app/hooks/use-notify'
import copy from '@app/utils/copy-text-to-clipboard'
import { SvgIcon, muiIconSizes } from '@app/views/components/SvgIcons'

import { UseAttributeCell } from '../hooks/use-attribute-cell'

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
      flexGrow: 1
    },
    selectLabel: {
      '&:focus': {
        backgroundColor: 'transparent'
      }
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
  isNew?: boolean
  attributeDef: IContactAttributeDef
  attribute?: IContactAttribute
  actions?: ReactNode
  onDiscard?: () => void
  onAdd?: UseAttributeCell['create']
  onUpdate?: UseAttributeCell['update']
  onDelete?: UseAttributeCell['remove']
}
interface FormData {
  text: string
  label: string
}

export function Attribute({
  isNew = false,
  attributeDef,
  attribute,
  actions,
  onDiscard,
  onUpdate,
  onDelete,
  onAdd
}: Props) {
  const classes = useStyles()
  const notify = useNotify()
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
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

  const handleSaveAttribute: SubmitHandler<FormData> = async ({
    text,
    label
  }) => {
    try {
      setIsSaving(true)

      if (attribute) {
        await onUpdate?.(attribute.id, { text, label })
      }

      await onAdd?.({ text, label })
    } finally {
      reset({ text, label })
      setIsSaving(false)
    }
  }

  const handleDeleteAttribute = async () => {
    if (isDeleting || !attribute) {
      return
    }

    setIsDeleting(true)
    await onDelete?.(attribute.id)
    setIsDeleting(false)
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

  const renderActionButton = () => {
    if (isDirty || isNew) {
      return (
        <>
          <ButtonBase
            disableRipple
            type="submit"
            disabled={isSaving || !isDirty}
            className={classes.saveButton}
          >
            {isSaving ? 'Saving!' : 'Save'}
          </ButtonBase>
          <ButtonBase
            disableRipple
            disabled={isSaving}
            onClick={() => {
              reset()
              onDiscard?.()
            }}
          >
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
          <SvgIcon
            path={isDeleting ? mdiLoading : mdiTrashCanOutline}
            spin={!!isDeleting}
            size={muiIconSizes.small}
          />
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
                disabled={isSaving || isDeleting}
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
              <NativeSelect
                {...props}
                id="label"
                disableUnderline
                disabled={isSaving || isDeleting}
                classes={{
                  root: classes.selectLabel
                }}
              >
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
