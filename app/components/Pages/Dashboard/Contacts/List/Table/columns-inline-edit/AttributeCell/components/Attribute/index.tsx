import { useState, ReactNode } from 'react'

import { Tooltip, ButtonBase, InputBase, NativeSelect } from '@material-ui/core'
import {
  mdiLoading,
  mdiContentCopy,
  mdiTrashCanOutline,
  mdiAlertCircleOutline
} from '@mdi/js'
import isEmpty from 'lodash/isEmpty'
import { useForm, Controller, SubmitHandler, Validate } from 'react-hook-form'

import useNotify from '@app/hooks/use-notify'
import copy from '@app/utils/copy-text-to-clipboard'
import { SvgIcon, muiIconSizes } from '@app/views/components/SvgIcons'

import { UseAttributeCell } from '../../hooks/use-attribute-cell'

import { useAttributeStyles } from './styles'

interface FormData {
  text: string
  label: string
}

export interface Props {
  attributeDef: IContactAttributeDef
  attribute?: IContactAttribute
  actions?: (attribute?: IContactAttribute) => ReactNode
  validateRules?: { [K in keyof FormData]?: Validate }
  onDiscard?: () => void
  onAdd?: UseAttributeCell['create']
  onUpdate?: UseAttributeCell['update']
  onDelete?: UseAttributeCell['remove']
}

export function Attribute({
  validateRules,
  attributeDef,
  attribute,
  actions,
  onDiscard,
  onUpdate,
  onDelete,
  onAdd
}: Props) {
  const classes = useAttributeStyles()
  const notify = useNotify()
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const {
    reset,
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting, errors }
  } = useForm<FormData>({
    reValidateMode: 'onChange',
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
      if (attribute) {
        await onUpdate?.(attribute.id, { text, label })
      }

      await onAdd?.({ text, label })
    } finally {
      reset({ text, label })
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
    copy(attribute?.text ?? '')
    notify({
      status: 'success',
      message: 'Copied!'
    })
  }

  const renderActionButton = () => {
    if (!isEmpty(errors)) {
      return (
        <Tooltip
          title={Object.values(errors).map(
            err =>
              err?.message && (
                <>
                  <span>{err.message}</span>
                  <br />
                </>
              )
          )}
        >
          <div className={classes.errors}>
            <SvgIcon path={mdiAlertCircleOutline} size={muiIconSizes.small} />
            <span className={classes.errorLabel}>Invalid</span>
          </div>
        </Tooltip>
      )
    }

    if (isDirty || !attribute) {
      return (
        <>
          <ButtonBase
            disableRipple
            type="submit"
            disabled={isSubmitting || !isDirty}
            className={classes.saveButton}
          >
            {isSubmitting ? 'Saving!' : 'Save'}
          </ButtonBase>
          <ButtonBase
            disableRipple
            disabled={isSubmitting || !isDirty}
            className={classes.discardButton}
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
          <div className={classes.customActionContainer}>
            {actions(attribute)}
          </div>
        )}
        <Tooltip title="Copy">
          <div className={classes.actionButton} onClick={handleCopyAttribute}>
            <SvgIcon path={mdiContentCopy} size={muiIconSizes.small} />
          </div>
        </Tooltip>
        <Tooltip title="Delete">
          <div className={classes.actionButton} onClick={handleDeleteAttribute}>
            <SvgIcon
              path={isDeleting ? mdiLoading : mdiTrashCanOutline}
              spin={!!isDeleting}
              size={muiIconSizes.small}
            />
          </div>
        </Tooltip>
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
            validate: (value: string) => {
              if (!value.trim()) {
                return 'Value is required.'
              }

              return validateRules?.text?.(value)
            }
          }}
          render={props => (
            <InputBase
              {...props}
              autoFocus
              margin="none"
              disabled={isSubmitting || isDeleting}
              className={classes.value}
            />
          )}
        />

        {attributeDef.labels && (
          <Controller
            name="label"
            control={control}
            rules={{
              validate: (value: string) => {
                if (!value.trim()) {
                  return 'Label is required.'
                }

                return validateRules?.label?.(value)
              }
            }}
            render={props => (
              <NativeSelect
                {...props}
                id="label"
                disableUnderline
                disabled={isSubmitting || isDeleting}
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
