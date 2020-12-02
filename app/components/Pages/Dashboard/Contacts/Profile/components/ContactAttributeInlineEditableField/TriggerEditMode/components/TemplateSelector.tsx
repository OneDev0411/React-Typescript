import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles, Theme, Typography, Box } from '@material-ui/core'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import cn from 'classnames'

import { IAppState } from 'reducers'

import MarketingTemplateEditor from 'components/MarketingTemplateEditor'
import MarketingTemplatePickerModal from 'components/MarketingTemplatePickerModal'

import { getActiveTeamId, getActiveBrand } from 'utils/user-teams'

import { getTemplates } from 'models/instant-marketing/get-templates'
import { TriggerTemplateInput } from 'models/instant-marketing/triggers/types'
import { renderBrandedNunjucksTemplate } from 'utils/marketing-center/render-branded-nunjucks-template'

import { getTemplateType } from '../helpers'

interface Props {
  disabled?: boolean
  currentValue: Nullable<ITrigger>
  attributeName: TriggerContactEventTypes
  selectedTemplate: Nullable<TriggerTemplateInput>
  onSelectTemplate: (template: TriggerTemplateInput) => void
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
  currentValue,
  attributeName,
  disabled = false,
  selectedTemplate,
  onSelectTemplate
}: Props) => {
  const classes = useStyles()
  const user = useSelector<IAppState, IUser>(store => store.user)

  const [baseTemplate, setBaseTemplate] = useState<
    Nullable<IBrandMarketingTemplate>
  >(null)
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState<boolean>(
    false
  )
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false)
  const [isSettingDefaultTemplate, setIsSettingDefaultTemplate] = useState<
    boolean
  >(false)

  const handleSelectTemplate = async (template: IBrandMarketingTemplate) => {
    try {
      const brand = getActiveBrand(user)

      if (!brand) {
        return
      }

      const templateMarkup = await renderBrandedNunjucksTemplate(
        template,
        brand,
        { user }
      )

      setBaseTemplate(template)
      onSelectTemplate({ id: template.template.id, markup: templateMarkup })

      setIsTemplatePickerOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleEditTemplate = (markup: string) => {
    if (!baseTemplate) {
      return
    }

    onSelectTemplate({ id: baseTemplate.template.id, markup })
    setIsBuilderOpen(false)
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
            handleSelectTemplate(templates[0])
          }
        })
        .catch(err => {
          setIsSettingDefaultTemplate(false)
          console.error(err)
        })
    }
  })

  const renderPreview = () => {
    if (isSettingDefaultTemplate) {
      return (
        <span className={classes.templatePreviewPlaceholder}>Loading...</span>
      )
    }

    if (disabled || (!baseTemplate && !currentValue)) {
      return (
        <span className={classes.templatePreviewPlaceholder}>
          Select a template
        </span>
      )
    }

    if (baseTemplate) {
      return (
        <img
          src={baseTemplate.preview.preview_url}
          alt="Selected Template"
          className={classes.templatePreviewImage}
        />
      )
    }

    if (currentValue) {
      const preview = currentValue.campaign?.template?.file?.preview_url

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
      {isBuilderOpen && baseTemplate && (
        <MarketingTemplateEditor
          brandTemplate={baseTemplate}
          onSave={handleEditTemplate}
          onClose={() => handleShowBuilder(false)}
        />
      )}
    </>
  )
}
