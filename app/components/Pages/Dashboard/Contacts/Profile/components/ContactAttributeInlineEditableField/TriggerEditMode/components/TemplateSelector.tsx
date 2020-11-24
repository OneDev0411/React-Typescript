import React from 'react'
import _get from 'lodash/get'
import { makeStyles, Theme, Typography } from '@material-ui/core'

interface Props {
  currentValue: Nullable<ITrigger>
  selectedTemplate: Nullable<IBrandMarketingTemplate>
  handleShowTemplatePicker: () => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {},
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    headerTitle: theme.typography.subtitle3,
    openTemplatePicker: {
      color: theme.palette.secondary.main,
      cursor: 'pointer'
    },
    templatePreview: {
      marginTop: theme.spacing(1),
      height: '445px',
      background: theme.palette.grey[100],
      borderRadius: `${theme.spacing(2)}px`,
      textAlign: 'center',
      color: theme.palette.secondary.main,
      overflow: 'hidden',
      cursor: 'pointer',
      ...theme.typography.body2
    },
    templatePreviewImage: {
      display: 'block',
      maxWidth: '100%'
    },
    templatePreviewPlaceholder: {
      display: 'block',
      lineHeight: '445px'
    }
  }),
  { name: 'TemplateSelector' }
)

export const TemplateSelector = ({
  currentValue,
  selectedTemplate,
  handleShowTemplatePicker
}: Props) => {
  const classes = useStyles()

  const renderPreview = () => {
    if (selectedTemplate) {
      return (
        <img
          src={selectedTemplate.preview.preview_url}
          alt="Selected Template"
          className={classes.templatePreviewImage}
        />
      )
    }

    if (currentValue) {
      const preview = _get(
        currentValue,
        'campaign.template.file.preview_url',
        false
      )

      if (!preview) {
        return (
          <span className={classes.templatePreviewPlaceholder}>
            Preview is not available
          </span>
        )
      }

      return (
        <img
          src={preview}
          alt="Selected Template"
          className={classes.templatePreviewImage}
        />
      )
    }

    return (
      <span className={classes.templatePreviewPlaceholder}>
        Select a Template
      </span>
    )
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <span className={classes.headerTitle}>Template</span>
        {(selectedTemplate || currentValue) && (
          <Typography
            variant="body2"
            className={classes.openTemplatePicker}
            onClick={handleShowTemplatePicker}
          >
            Change
          </Typography>
        )}
      </div>
      <div
        className={classes.templatePreview}
        onClick={handleShowTemplatePicker}
      >
        {renderPreview()}
      </div>
    </div>
  )
}
