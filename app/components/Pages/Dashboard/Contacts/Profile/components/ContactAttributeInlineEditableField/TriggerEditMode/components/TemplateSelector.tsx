import React, { useState } from 'react'
import { makeStyles, Theme, Typography, Box } from '@material-ui/core'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import cn from 'classnames'

import MarketingTemplateEditor from 'components/MarketingTemplateEditor'
import MarketingTemplatePickerModal from 'components/MarketingTemplatePickerModal'

import { getActiveTeamId } from 'utils/user-teams'

import { getTemplates } from 'models/instant-marketing/get-templates'

import { getTemplateType } from '../helpers'

interface Props {
  user: IUser
  disabled?: boolean
  currentValue: Nullable<ITrigger>
  attributeName: TriggerContactEventTypes
  selectedTemplate: Nullable<IBrandMarketingTemplate>
  onSelectTemplate: (template: IBrandMarketingTemplate) => void
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
    templateHandler: {
      color: theme.palette.secondary.main,
      cursor: 'pointer',
      '&:not(:last-child)': {
        marginRight: theme.spacing(1.25)
      }
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
    },
    disabled: {
      opacity: 0.4,
      '& $templateHandler, & $templatePreview': {
        cursor: 'default'
      }
    }
  }),
  { name: 'TemplateSelector' }
)

export const TemplateSelector = ({
  user,
  currentValue,
  attributeName,
  disabled = false,
  selectedTemplate,
  onSelectTemplate
}: Props) => {
  const classes = useStyles()
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState<boolean>(
    false
  )
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false)
  const [isSettingDefaultTemplate, setIsSettingDefaultTemplate] = useState<
    boolean
  >(false)

  useEffectOnce(() => {
    const brandId = getActiveTeamId(user)

    if (!brandId || disabled) {
      return
    }

    if (!selectedTemplate && !currentValue) {
      setIsSettingDefaultTemplate(true)
      getTemplates(
        brandId,
        [getTemplateType(attributeName)],
        ['Email' as MarketingTemplateMedium.Email]
      )
        .then(templates => {
          setIsSettingDefaultTemplate(false)

          if (templates.length) {
            onSelectTemplate(templates[0])
          }
        })
        .catch(err => {
          setIsSettingDefaultTemplate(false)
          console.error(err)
        })
    }
  })

  const handleSelectTemplate = (template: IBrandMarketingTemplate) => {
    try {
      onSelectTemplate(template)
      setIsTemplatePickerOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleShowTemplatePicker = (state: boolean = false) => {
    if (disabled) {
      return
    }

    setIsTemplatePickerOpen(state)
  }

  const handleShowBuilder = (state: boolean = false) => {
    if (disabled) {
      return
    }

    setIsBuilderOpen(state)
  }

  const renderPreview = () => {
    if (isSettingDefaultTemplate) {
      return (
        <span className={classes.templatePreviewPlaceholder}>Loading...</span>
      )
    }

    if (disabled || (!selectedTemplate && !currentValue)) {
      return (
        <span className={classes.templatePreviewPlaceholder}>
          Select a template
        </span>
      )
    }

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
      const preview = (currentValue.campaign as IEmailCampaign).template?.file
        ?.preview_url

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
        Somthing went wrong :(
      </span>
    )
  }

  return (
    <>
      <div className={cn(classes.container, { [classes.disabled]: disabled })}>
        <div className={classes.header}>
          <span className={classes.headerTitle}>Template</span>
          <Box display="inline-flex">
            {selectedTemplate && (
              <Typography
                variant="body2"
                className={classes.templateHandler}
                onClick={() => handleShowBuilder(true)}
              >
                Edit
              </Typography>
            )}
            {(selectedTemplate || currentValue) && (
              <Typography
                variant="body2"
                className={classes.templateHandler}
                onClick={() => handleShowTemplatePicker(true)}
              >
                Change
              </Typography>
            )}
          </Box>
        </div>
        <div
          className={classes.templatePreview}
          onClick={() => handleShowTemplatePicker(true)}
        >
          {renderPreview()}
        </div>
      </div>
      {isTemplatePickerOpen && (
        <MarketingTemplatePickerModal
          title="Select Template"
          user={user}
          mediums={['Email' as MarketingTemplateMedium.Email]}
          templateTypes={[getTemplateType(attributeName)]}
          onSelect={handleSelectTemplate}
          onClose={() => handleShowTemplatePicker(false)}
        />
      )}
      {isBuilderOpen && selectedTemplate && (
        <MarketingTemplateEditor
          brandTemplate={selectedTemplate}
          onSave={t => {
            console.log('MarketingTemplateEditor', t)
          }}
          onClose={() => handleShowBuilder(false)}
        />
      )}
    </>
  )
}
