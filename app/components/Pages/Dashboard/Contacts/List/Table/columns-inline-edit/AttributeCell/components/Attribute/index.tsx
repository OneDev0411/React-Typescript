import { useState, ReactNode } from 'react'

import { ButtonBase, InputBase, NativeSelect } from '@material-ui/core'
import {
  mdiLoading,
  mdiContentCopy,
  mdiTrashCanOutline
  // mdiAlertCircleOutline
} from '@mdi/js'
// import isEmpty from 'lodash/isEmpty'
import {
  useForm,
  Controller,
  SubmitHandler,
  UseControllerOptions
} from 'react-hook-form'

import useNotify from '@app/hooks/use-notify'
import copy from '@app/utils/copy-text-to-clipboard'
import { SvgIcon, muiIconSizes } from '@app/views/components/SvgIcons'

import { UseAttributeCell } from '../../hooks/use-attribute-cell'

import { useAttributeStyles } from './styles'

interface FormData {
  text: string
  label: string
}
interface Props {
  isNew?: boolean
  attributeDef: IContactAttributeDef
  attribute?: IContactAttribute
  actions?: ReactNode
  validateRules?: Record<Partial<keyof FormData>, UseControllerOptions['rules']>
  onDiscard?: () => void
  onAdd?: UseAttributeCell['create']
  onUpdate?: UseAttributeCell['update']
  onDelete?: UseAttributeCell['remove']
}

export function Attribute({
  isNew = false,
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

  console.log({ errors })

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
    // if (!isEmpty(errors)) {
    // return (
    //   <Tooltip title={errors}>
    //     <div className={classes.errors}>
    //       <span>Invalid</span>
    //       <SvgIcon path={mdiAlertCircleOutline} size={muiIconSizes.small} />
    //     </div>
    //   </Tooltip>
    // )
    // }

    if (isDirty || isNew) {
      return (
        <>
          <ButtonBase
            disableRipple
            type="submit"
            // disabled={isSubmitting || !isDirty}
            className={classes.saveButton}
          >
            {isSubmitting ? 'Saving!' : 'Save'}
          </ButtonBase>
          <ButtonBase
            disableRipple
            disabled={isSubmitting}
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
            validate: (value: string) => !!value.trim() || 'Value is required.',
            min: 15,
            ...(validateRules?.text || {})
          }}
          render={props => (
            <InputBase
              {...props}
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
              validate: (value: string) =>
                !!value.trim() || 'Label is required.',
              ...(validateRules?.label || {})
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
