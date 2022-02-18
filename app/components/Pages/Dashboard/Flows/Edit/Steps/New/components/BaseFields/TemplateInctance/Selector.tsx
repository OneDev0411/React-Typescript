import { useState, useMemo } from 'react'

import {
  Box,
  Grid,
  Theme,
  Button,
  makeStyles,
  Typography
} from '@material-ui/core'
import cn from 'classnames'
import { useSelector } from 'react-redux'

import MarketingTemplateEditor from 'components/MarketingTemplateEditor'
import MarketingTemplateAndTemplateInstancePickerModal from 'components/MarketingTemplatePickers/MarketingTemplateAndTemplateInstancePickerModal'
import { getTemplateInstance } from 'models/instant-marketing/triggers/helpers/get-template-instance'
import { IAppState } from 'reducers'
import { selectUser } from 'selectors/user'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      position: 'relative',
      height: '445px', // From figma
      background: theme.palette.grey[100],
      borderRadius: theme.shape.borderRadius,
      textAlign: 'center',
      color: theme.palette.secondary.main,
      overflow: 'hidden',
      cursor: 'pointer',
      ...theme.typography.body2,
      '&:hover $containerPreview': {
        visibility: 'visible',
        opacity: 1
      }
    },
    containerPreview: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.palette.action.active,
      borderRadius: theme.shape.borderRadius,
      cursor: 'default',
      transition: 'all 0.2s linear',
      visibility: 'hidden',
      opacity: 0
    },
    templateAction: {
      background: theme.palette.background.paper,
      width: '160px'
    },
    templateImage: {
      display: 'block',
      maxWidth: '100%'
    },
    templatePreviewPlaceholder: {
      display: 'block',
      lineHeight: '445px' // From figma
    },
    disabled: {
      opacity: 0.4,
      '& $templateHandler, & $container': {
        cursor: 'default'
      }
    },
    hasError: {
      border: `1px solid ${theme.palette.error.main}`
    }
  }),
  { name: 'GlobalTriggerTemplateSelector' }
)

interface Props {
  disabled?: boolean
  hasError?: boolean
  error?: Nullable<string>
  templateTypes: IMarketingTemplateType[]
  currentTemplate?: Nullable<
    IMarketingTemplateInstance | IBrandMarketingTemplate
  >
  onChange: (
    value: IMarketingTemplateInstance | IBrandMarketingTemplate
  ) => void
}

export const TemplateSelector = ({
  disabled = false,
  hasError = false,
  error = null,
  templateTypes,
  currentTemplate = null,
  onChange
}: Props) => {
  const classes = useStyles()
  const user = useSelector<IAppState, IUser>(selectUser)

  const [isTemplatePickerOpen, setIsTemplatePickerOpen] =
    useState<boolean>(false)
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Current Selected Template
  const initialSelectedTemplate = () => currentTemplate ?? null
  const [selectedTemplate, setSelectedTemplate] = useState<
    Nullable<IMarketingTemplateInstance | IBrandMarketingTemplate>
  >(initialSelectedTemplate)

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

  const handleSelectTemplate = async (
    template: IBrandMarketingTemplate | IMarketingTemplateInstance
  ) => {
    setIsTemplatePickerOpen(false)
    setSelectedTemplate(template)
    onChange(template)
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

      setSelectedTemplate(templateInstance)
      onChange(templateInstance)
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
          className={classes.templateImage}
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
      <Box
        className={cn(classes.container, {
          [classes.disabled]: disabled,
          [classes.hasError]: hasError
        })}
      >
        <Box
          className={classes.container}
          onClick={() =>
            !selectedTemplate && !disabled && handleShowTemplatePicker(true)
          }
        >
          {!isLoading && selectedTemplate && !disabled && (
            <Box className={classes.containerPreview}>
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item>
                  <Button
                    variant="contained"
                    size="small"
                    className={classes.templateAction}
                    onClick={() => handleShowBuilder(true)}
                  >
                    Edit Template
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    size="small"
                    className={classes.templateAction}
                    onClick={() => handleShowTemplatePicker(true)}
                  >
                    Change Template
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
          {renderPreview()}
        </Box>
      </Box>
      {error && (
        <Box mt={0.5}>
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        </Box>
      )}
      {isTemplatePickerOpen && (
        <MarketingTemplateAndTemplateInstancePickerModal
          title="Select Template"
          user={user}
          mediums={['Email']}
          templateTypes={templateTypes}
          onSelect={handleSelectTemplate}
          onClose={() => handleShowTemplatePicker(false)}
        />
      )}
      {isBuilderOpen && selectedTemplate && (
        <MarketingTemplateEditor
          template={selectedTemplate}
          templateData={{ user }}
          templatePurpose="ForOtherAgents"
          onSave={handleEditTemplate}
          onClose={() => handleShowBuilder(false)}
        />
      )}
    </>
  )
}
