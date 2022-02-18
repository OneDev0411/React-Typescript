import { useState, useMemo } from 'react'

import { makeStyles, Theme, Typography, Box } from '@material-ui/core'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { useUnsafeActiveBrand } from '@app/hooks/brand/use-unsafe-active-brand'
import MarketingTemplateEditor from 'components/MarketingTemplateEditor'
import MarketingTemplateAndTemplateInstancePickerModal from 'components/MarketingTemplatePickers/MarketingTemplateAndTemplateInstancePickerModal'
import { getTemplates } from 'models/instant-marketing/get-templates'
import {
  getTemplateInstance,
  createTemplateInstance
} from 'models/instant-marketing/triggers/helpers'
import { IAppState } from 'reducers'
import { selectUser } from 'selectors/user'

import { getTemplateType } from '../helpers'

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

interface Props {
  disabled?: boolean
  attributeName: TriggerContactEventTypes
  selectedTemplate: Nullable<
    IMarketingTemplateInstance | IBrandMarketingTemplate
  >
  onSelectTemplate: (template: IMarketingTemplateInstance) => void
}

export const TemplateSelector = ({
  attributeName,
  disabled = false,
  selectedTemplate,
  onSelectTemplate
}: Props) => {
  const classes = useStyles()
  const user = useSelector<IAppState, IUser>(selectUser)
  const activeBrand: Nullable<IBrand> = useUnsafeActiveBrand()
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] =
    useState<boolean>(false)
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const templatePreviewUrl: Nullable<string> = useMemo(() => {
    if (!selectedTemplate) {
      return null
    }

    if (selectedTemplate.type === 'template_instance') {
      return selectedTemplate.file.preview_url
    }

    if (selectedTemplate.type === 'brand_template') {
      return selectedTemplate.preview.preview_url
    }

    return null
  }, [selectedTemplate])

  const handleCreateTemplateInstance = async (
    template: IBrandMarketingTemplate
  ) => createTemplateInstance(template, activeBrand, { user })

  const handleSelectTemplate = async (
    template: IBrandMarketingTemplate | IMarketingTemplateInstance
  ) => {
    try {
      setIsTemplatePickerOpen(false)
      setIsLoading(true)

      const templateInstance =
        template.type === 'template_instance'
          ? template
          : await handleCreateTemplateInstance(template)

      if (templateInstance) {
        onSelectTemplate(templateInstance)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditTemplate = async (markup: string) => {
    try {
      const templateId = selectedTemplate?.template.id

      if (!templateId) {
        return
      }

      setIsLoading(true)
      setIsBuilderOpen(false)

      const templateInstance = await getTemplateInstance(templateId, markup)

      if (templateInstance) {
        onSelectTemplate(templateInstance)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
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

  useEffectOnce(() => {
    async function setInitialTemplate() {
      try {
        if (!activeBrand || disabled) {
          return
        }

        setIsLoading(true)

        const templates = await getTemplates(
          activeBrand.id,
          [getTemplateType(attributeName)],
          ['Email']
        )

        if (templates.length) {
          handleSelectTemplate(templates[0])
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!selectedTemplate) {
      setInitialTemplate()
    }
  })

  const renderPreview = () => {
    if (isLoading) {
      return (
        <span className={classes.templatePreviewPlaceholder}>Loading...</span>
      )
    }

    if (!selectedTemplate) {
      return (
        <span className={classes.templatePreviewPlaceholder}>
          Select a template
        </span>
      )
    }

    if (templatePreviewUrl) {
      return (
        <img
          src={templatePreviewUrl}
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
            {selectedTemplate && (
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
        <MarketingTemplateAndTemplateInstancePickerModal
          title="Select Template"
          user={user}
          mediums={['Email']}
          templateTypes={[getTemplateType(attributeName)]}
          onSelect={handleSelectTemplate}
          onClose={() => handleShowTemplatePicker(false)}
        />
      )}
      {isBuilderOpen && selectedTemplate && (
        <MarketingTemplateEditor
          template={selectedTemplate}
          templateData={{ user }}
          onSave={handleEditTemplate}
          onClose={() => handleShowBuilder(false)}
        />
      )}
    </>
  )
}
