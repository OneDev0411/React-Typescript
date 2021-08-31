import { useMemo, ChangeEvent } from 'react'

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Theme,
  FormHelperText,
  makeStyles
} from '@material-ui/core'
import { Field } from 'react-final-form'
import { useDispatch, useSelector } from 'react-redux'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { selectActiveBrandId } from '@app/selectors/brand'
import { Iframe } from '@app/views/components/Iframe'
import { fetchEmailTemplates } from 'actions/email-templates/fetch-email-templates'
import { IAppState } from 'reducers'
import {
  selectEmailTemplates,
  selectEmailTemplatesIsFetching
} from 'reducers/email-templates'

interface Props {
  currentTemplateId?: Nullable<UUID>
  disabled: boolean
  // onNewTemplateClick: () => void
}

type EmailTemplates = {
  templates: IBrandEmailTemplate[]
  isFetching: boolean
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    reviewContainer: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(2),
      background: theme.palette.grey[100],
      borderRadius: '8px'
    },
    reviewContainerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    newTemplate: {
      borderTopWidth: '1px',
      borderBottomWidth: '1px',
      borderStyle: 'solid',
      borderColor: theme.palette.divider
    }
  }),
  { name: 'FlowEmailTemplate' }
)

export const EmailTemplate = ({
  currentTemplateId,
  disabled
}: // onNewTemplateClick
Props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const brandId: UUID = useSelector(selectActiveBrandId)
  const { templates, isFetching } = useSelector<IAppState, EmailTemplates>(
    ({ emailTemplates }) => ({
      templates: selectEmailTemplates(emailTemplates, brandId),
      isFetching: selectEmailTemplatesIsFetching(emailTemplates, brandId)
    })
  )

  console.log('EmailTemplate', { brandId, templates, isFetching })

  // const defaultTemplate = useMemo(
  //   () => (templates.find(({ id }) => id === defaultSelectedTemplate) || {}).id,
  //   [defaultSelectedTemplate, templates]
  // )

  const emailTemplatesOptions = useMemo(
    () =>
      templates.map(template => ({
        label: template.name,
        value: template.id
      })),
    [templates]
  )

  const selectedItem = useMemo(() => {
    const defaultValue = {
      label: 'Select a Template',
      value: 0
    }

    if (currentTemplateId) {
      const template = emailTemplatesOptions.find(
        item => item.value === currentTemplateId
      )

      return template || defaultValue
    }

    return defaultValue
  }, [currentTemplateId, emailTemplatesOptions])

  const reviewTemplateData: Nullable<IBrandEmailTemplate> = useMemo(() => {
    if (!currentTemplateId) {
      return null
    }

    const selectedTemplate = templates.find(
      ({ id }) => id === currentTemplateId
    )

    if (!selectedTemplate) {
      return null
    }

    console.log({ selectedTemplate })

    return selectedTemplate
  }, [currentTemplateId, templates])

  const handleValidation = value => {
    if (value) {
      return
    }

    return 'No email template selected'
  }

  useEffectOnce(() => {
    dispatch(fetchEmailTemplates(brandId))
  })

  return (
    <Box>
      <Field
        isRequired
        name="email_template"
        label="Email Template"
        text="Select an email template"
        items={emailTemplatesOptions}
        validate={handleValidation}
        render={({ input: { name, onChange, value }, meta }) => {
          const showError = Boolean(meta.submitFailed && meta.error)

          return (
            <Box>
              <FormControl
                fullWidth
                variant="outlined"
                size="small"
                color="secondary"
                error={showError}
              >
                <InputLabel id="email_template">Template</InputLabel>
                <Select
                  labelId="email_template"
                  id="email_template-select"
                  name={name}
                  value={selectedItem.value}
                  disabled={disabled || isFetching}
                  onChange={(
                    event: ChangeEvent<{ value: string | number }>
                  ) => {
                    const value = event.target.value

                    if (value === 'new') {
                      // return onNewTemplateClick()
                      return null
                    }

                    onChange(value)
                  }}
                  label="Template"
                >
                  <MenuItem key="default" value={0}>
                    Select a Template
                  </MenuItem>
                  <MenuItem
                    key="new"
                    value="new"
                    className={classes.newTemplate}
                  >
                    Create a New Template
                  </MenuItem>
                  {emailTemplatesOptions.map(item => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
                {showError && (
                  <FormHelperText variant="standard">
                    {meta.error}
                  </FormHelperText>
                )}
              </FormControl>
              {reviewTemplateData && (
                <Box className={classes.reviewContainer}>
                  <Box className={classes.reviewContainerHeader}>
                    <Typography variant="body2">
                      Subject: {reviewTemplateData.subject}
                    </Typography>
                  </Box>
                  <Iframe
                    fullWidth
                    title="Email body"
                    srcDoc={
                      reviewTemplateData.body ?? reviewTemplateData.text ?? ''
                    }
                  />
                </Box>
              )}
            </Box>
          )
        }}
      />
    </Box>
  )
}
