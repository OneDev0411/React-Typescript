import * as React from 'react'
import {
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { useControllableState } from 'react-use-controllable-state/dist'
import {
  Button,
  createStyles,
  makeStyles,
  TextField,
  Theme
} from '@material-ui/core'
import { TextFieldProps } from '@material-ui/core/TextField'

import classNames from 'classnames'
import { mdiPencilOutline } from '@mdi/js'

import { useOnToggledOn } from '../../TextEditor/features/RichText/LinkEditorPopover/hooks/use-on-toggled'
import { SvgIcon } from '../../SvgIcons/SvgIcon'

interface Props {
  children?: ReactNode
  /**
   * optional control over editing. You need to handle onEditingChange if
   * editing is passed
   */
  editing?: boolean
  onEditingChange?: (editing: boolean) => void
  TextFieldProps?: TextFieldProps
  value: string
  blurBehaviour?: 'Save' | 'Cancel' | 'None'
  amendEditIcon?: boolean
  showSaveButton?: boolean
  onSave: (newValue: string) => Promise<string | void> | string | void
}

const useInlineEditableStringStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      viewRoot: {
        display: 'inline-flex',
        alignItems: 'center',
        '&:hover $editIcon': {
          opacity: 1
        }
      },
      inputRoot: {
        paddingRight: theme.spacing(0.5)
      },
      input: {
        padding: '0.625rem .5rem'
      },
      textField: {
        // to compensate for horizontal padding of the input
        transform: 'translateX(-0.5rem)'
      },
      editIcon: {
        verticalAlign: 'text-bottom',
        opacity: 0,
        transition: 'opacity 300ms'
      }
    }),
  { name: 'InlineEditableString' }
)
/**
 * This component is written because the product design for checklist management
 * doesn't fit out current InlineEditableField.
 */
export const InlineEditableString = forwardRef(function InlineEditableString(
  {
    blurBehaviour = 'Cancel',
    TextFieldProps = {},
    showSaveButton = true,
    ...props
  }: Props,
  ref
) {
  const [editing, setEditing] = useControllableState(
    props.editing,
    props.onEditingChange,
    false
  )

  const [editingValue, setEditingValue] = useState('')
  const [saving, setSaving] = useState(false)

  const classes = useInlineEditableStringStyles(props)

  const edit = useCallback(() => setEditing(true), [setEditing])

  useImperativeHandle(ref, () => ({
    edit
  }))

  const isClickingSaveRef = useRef<boolean>(false)

  const save = async () => {
    isClickingSaveRef.current = false
    setSaving(true)
    await props.onSave(editingValue)
    setSaving(false)
    setEditing(false)
  }

  useOnToggledOn(
    editing,
    useCallback(() => {
      setEditingValue(props.value)
    }, [props.value])
  )

  const onKeyUp: React.KeyboardEventHandler = event => {
    if (event.key === 'Enter') {
      save()
    }

    if (event.key === 'Escape') {
      setEditing(false)
    }
  }
  const onBlur = async () => {
    if (isClickingSaveRef.current) {
      return
    }

    if (blurBehaviour === 'Save') {
      await save()
    }

    if (blurBehaviour !== 'None') {
      setEditing(false)
    }
  }

  const onSaveMouseDown = () => {
    isClickingSaveRef.current = true
    document.addEventListener(
      'mouseup',
      () => {
        if (isClickingSaveRef.current) {
          isClickingSaveRef.current = false
          onBlur()
        }
      },
      { once: true, capture: false }
    )
  }

  if (editing) {
    return (
      <TextField
        variant="filled"
        inputProps={{
          ...(TextFieldProps.inputProps || {}),
          onKeyUp,
          onBlur
        }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        InputProps={{
          classes: { input: classes.input, root: classes.inputRoot },
          endAdornment: showSaveButton ? (
            <Button
              size="small"
              variant="text"
              color="primary"
              onMouseUp={save}
              onMouseDown={onSaveMouseDown}
            >
              Save
            </Button>
          ) : undefined
        }}
        classes={{
          root: classNames(
            classes.textField,
            (TextFieldProps.classes || {}).root
          )
        }}
        {...(TextFieldProps as any)}
        value={editingValue}
        disabled={saving}
        autoFocus
        onChange={event => setEditingValue(event.target.value)}
      />
    )
  }

  return typeof props.children === 'function' ? (
    props.children({ edit, save, saving })
  ) : (
    <span className={classes.viewRoot} onClick={edit}>
      {props.children || props.value}{' '}
      <SvgIcon path={mdiPencilOutline} className={classes.editIcon} />
    </span>
  )
})
