import { useState, useMemo } from 'react'

import {
  FormControlLabel,
  Typography,
  Switch,
  Theme,
  makeStyles
} from '@material-ui/core'

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
    }
  }),
  {
    name: 'GlobalTriggerItem'
  }
)

interface Props {
  trigger: IGlobalTrigger
}

export function Item({ trigger }: Props) {
  const classes = useStyles()
  const [checked, setChecked] = useState(false)

  const templatePreview: Nullable<string> = useMemo(() => {
    if (trigger.template) {
      return trigger.template.preview.preview_url
    }

    if (trigger.template_instance) {
      return trigger.template_instance.file.preview_url
    }

    return null
  }, [trigger.template, trigger.template_instance])

  const toggleChecked = () => {
    setChecked(prev => !prev)
  }

  return (
    <div className={classes.container}>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={toggleChecked}
            size="small"
            color="primary"
            name="event_type"
          />
        }
        label={trigger.event_type}
        className={classes.switchState}
      />
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
  )
}
