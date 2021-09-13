import { useState, useMemo, ChangeEvent } from 'react'

import {
  FormControlLabel,
  Typography,
  Switch,
  Theme,
  makeStyles
} from '@material-ui/core'
import cn from 'classnames'

import {
  enableTrigger,
  disableTrigger
} from '@app/models/instant-marketing/global-triggers'

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
      margin: theme.spacing(0),
      paddingBottom: theme.spacing(0.5)
    },
    templatePreviewContainer: {
      padding: theme.spacing(1),
      position: 'relative',
      // height: '330px', // From figma
      maxWidth: '195px', // From figma
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
    subject: {
      display: 'block'
    },
    disabled: {
      opacity: 0.5
    }
  }),
  {
    name: 'GlobalTriggerItem'
  }
)

interface Props {
  trigger: IGlobalTrigger
}

export function Item({ trigger: triggerProp }: Props) {
  const classes = useStyles()
  const [trigger, setTrigger] = useState<IGlobalTrigger>(triggerProp)
  const [isEanable, setIsEanable] = useState<boolean>(!trigger.deleted_at)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const templatePreview: Nullable<string> = useMemo(() => {
    if (trigger.template) {
      return trigger.template.preview.preview_url
    }

    if (trigger.template_instance) {
      return trigger.template_instance.file.preview_url
    }

    return null
  }, [trigger.template, trigger.template_instance])

  const toggleStatus = async (event: ChangeEvent<HTMLInputElement>) => {
    if (isLoading) {
      return null
    }

    const { id, brand } = trigger
    const isEnabling = event.target.checked

    try {
      setIsLoading(true)

      const res = isEnabling
        ? await enableTrigger(id, brand)
        : await disableTrigger(id, brand)

      setTrigger(res)
      setIsEanable(!res.deleted_at)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={classes.container}>
      <FormControlLabel
        control={
          <Switch
            checked={isEanable}
            onChange={toggleStatus}
            size="small"
            color="primary"
            name="event_type"
          />
        }
        label={trigger.event_type}
        className={classes.switchState}
      />
      <div className={cn({ [classes.disabled]: !isEanable || isLoading })}>
        <div className={classes.templatePreviewContainer}>
          {templatePreview && (
            <img
              src={templatePreview}
              alt="Selected Template"
              className={classes.templatePreview}
            />
          )}
        </div>
        <Typography variant="caption" color="textSecondary">
          Email Subject
        </Typography>
        <Typography
          variant="body2"
          color="textPrimary"
          className={classes.subject}
        >
          {trigger.subject}
        </Typography>
      </div>
    </div>
  )
}
