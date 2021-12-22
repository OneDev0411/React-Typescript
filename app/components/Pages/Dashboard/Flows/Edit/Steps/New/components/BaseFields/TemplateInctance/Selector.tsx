import { useState, useMemo } from 'react'

import {
  Box,
  Typography,
  makeStyles,
  Theme,
  Button,
  Grid
} from '@material-ui/core'
import cn from 'classnames'
import { useSelector } from 'react-redux'

import useNotify from '@app/hooks/use-notify'
import MarketingTemplateEditor from 'components/MarketingTemplateEditor'
import MarketingTemplateAndTemplateInstancePickerModal from 'components/MarketingTemplatePickers/MarketingTemplateAndTemplateInstancePickerModal'
import { getTemplateInstance } from 'models/instant-marketing/triggers/helpers/get-template-instance'
import { IAppState } from 'reducers'
import { selectUser } from 'selectors/user'
import { getActiveBrand } from 'utils/user-teams'

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
  templateType: IMarketingTemplateType[]
  currentTemplateInstance?: Nullable<IMarketingTemplateInstance>
  onChange: (value: IGlobalTriggerFormData['template']) => void
}

export const TemplateSelector = ({
  disabled = false,
  hasError = false,
  error = null,
  templateType,
  currentTemplateInstance = null,
  onChange
}: Props) => {
  const classes = useStyles()
  const notify = useNotify()
  const user = useSelector<IAppState, IUser>(selectUser)
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] =
    useState<boolean>(false)
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Current Selected Template
  const initialSelectedTemplate = () => currentTemplateInstance ?? null
  const [selectedTemplate, setSelectedTemplate] = useState<
    Nullable<IMarketingTemplateInstance | IBrandMarketingTemplate>
  >(initialSelectedTemplate)

  const brand: Nullable<IBrand> = useMemo(() => getActiveBrand(user), [user])

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
    try {
      setIsTemplatePickerOpen(false)
      setIsLoading(true)

      if (!brand) {
        return notify({
          status: 'warning',
          message: 'Brand is not available.'
        })
      }

      const isTemplateInstance = template.type === 'template_instance'

      setSelectedTemplate(template)

      onChange({
        isInstance: isTemplateInstance,
        data: template
      })
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

      setSelectedTemplate(templateInstance)
      onChange({
        isInstance: true,
        data: templateInstance
      })
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
          templateTypes={templateType}
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
