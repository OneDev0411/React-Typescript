import { useState, useMemo, useRef, ChangeEvent, MouseEvent } from 'react'

import {
  FormControlLabel,
  Typography,
  Switch,
  Theme,
  makeStyles
} from '@material-ui/core'
import cn from 'classnames'
import pluralize from 'pluralize'
import { useDispatch } from 'react-redux'

import { convertSecondsToDay } from '@app/components/Pages/Dashboard/Contacts/Profile/components/ContactAttributeInlineEditableField/TriggerEditMode/helpers'
import {
  enableTrigger,
  disableTrigger
} from '@app/models/instant-marketing/global-triggers'
import { setGlobalTrigger as toggleGlobalTrigger } from '@app/store_actions/global-triggers'

import { TriggerEditMode as EditMode } from '../../EditMode'

import { getAttributeName } from './helpers'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'inline-block',
      '&:not(:last-child)': {
        marginRight: theme.spacing(2)
      }
    },
    title: {
      marginBottom: theme.spacing(1.5)
    },
    switchState: {
      marginLeft: theme.spacing(-0.5)
    },
    waitFor: {
      margin: theme.spacing(0.5, 0, 1)
    },
    cover: {
      cursor: 'pointer'
    },
    templatePreviewContainer: {
      padding: theme.spacing(1),
      position: 'relative',
      maxWidth: '200px', // From figma
      background: theme.palette.common.white,
      border: `1px solid ${theme.palette.action.disabledBackground}`,
      borderRadius: theme.shape.borderRadius,
      textAlign: 'center',
      overflow: 'hidden'
    },
    templatePreview: {
      maxWidth: '100%',
      border: `1px solid ${theme.palette.action.disabledBackground}`,
      borderRadius: theme.shape.borderRadius
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  }),
  {
    name: 'GlobalTriggerItem'
  }
)

interface Props {
  trigger: IGlobalTrigger<'template' | 'template_instance'>
}

export function Item({ trigger }: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null)
  const editModeContainerRef = useRef<Nullable<HTMLDivElement>>(null)

  const isEnable: boolean = useMemo(
    () => !trigger.deleted_at,
    [trigger.deleted_at]
  )

  const templatePreview: Nullable<string> = useMemo(() => {
    if (trigger.template) {
      return trigger.template.preview.preview_url
    }

    if (trigger.template_instance) {
      return trigger.template_instance.file.preview_url
    }

    return null
  }, [trigger.template, trigger.template_instance])

  const triggerWaitFor: number = useMemo(
    () => convertSecondsToDay(trigger.wait_for),
    [trigger.wait_for]
  )

  const handleShowEdit = (event: MouseEvent<HTMLElement>) => {
    if (isLoading || !isEnable) {
      return
    }

    setAnchorEl(event.currentTarget)
  }

  const handleCloseEdit = () => {
    setAnchorEl(null)
  }

  const toggleStatus = async (event: ChangeEvent<HTMLInputElement>) => {
    if (isLoading) {
      return null
    }

    const { id, brand } = trigger
    const isEnabling = event.target.checked

    try {
      setIsLoading(true)

      const trigger: IGlobalTrigger<'template' | 'template_instance'> =
        isEnabling
          ? await enableTrigger(id, brand)
          : await disableTrigger(id, brand)

      dispatch(toggleGlobalTrigger(trigger))
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className={classes.container} ref={editModeContainerRef}>
        <FormControlLabel
          control={
            <Switch
              checked={isEnable}
              onChange={toggleStatus}
              size="small"
              color="primary"
              name="event_type"
            />
          }
          label={
            <Typography variant="body2">
              {getAttributeName(trigger.event_type)}
            </Typography>
          }
          className={classes.switchState}
        />
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.waitFor}
        >
          Send{' '}
          {triggerWaitFor == 0
            ? 'on the same day'
            : `${pluralize('day', triggerWaitFor, true)} earlier`}
        </Typography>
        <div
          className={cn(classes.cover, {
            [classes.disabled]: !isEnable || isLoading
          })}
          onClick={handleShowEdit}
        >
          <div className={classes.templatePreviewContainer}>
            {templatePreview && (
              <img
                src={templatePreview}
                alt="Selected Template"
                className={classes.templatePreview}
              />
            )}
          </div>
        </div>
      </div>
      <EditMode
        trigger={trigger}
        anchor={anchorEl}
        containerRef={editModeContainerRef.current}
        handleClose={handleCloseEdit}
      />
    </>
  )
}
