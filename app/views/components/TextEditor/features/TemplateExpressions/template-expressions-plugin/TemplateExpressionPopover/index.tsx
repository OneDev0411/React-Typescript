import { makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import * as React from 'react'
import { MouseEventHandler, Ref } from 'react'
import { mdiInformationOutline } from '@mdi/js'

import { ClassesProps } from 'utils/ts-utils'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { ITemplateVariableSuggestion } from 'components/TemplateVariablesButton'

import { styles } from './styles'

type Props = {
  onClick: MouseEventHandler
  expressionText: string
  fallback: string
  suggestion: ITemplateVariableSuggestion | undefined
  onFallbackChange: (fallback: string) => void
  innerRef?: Ref<HTMLElement>
  onSubmit?: () => void
}

const useStyles = makeStyles(styles, { name: 'TemplateExpressionPopover' })

export function TemplateExpressionPopover(
  props: Props & ClassesProps<typeof styles>
) {
  const classes = useStyles(props)

  const { title = props.expressionText, description = '' } =
    props.suggestion || {}

  return (
    <Paper
      innerRef={props.innerRef}
      onClick={props.onClick}
      className={classes.root}
      elevation={10}
    >
      {description && (
        <div className={classes.description}>
          <SvgIcon
            path={mdiInformationOutline}
            rightMargined
            size={muiIconSizes.small}
          />
          <Typography variant="body2">{description}</Typography>
        </div>
      )}
      <div className={classes.inputWrapper}>
        <TextField
          inputProps={{
            onKeyDown: e => {
              if (e.key === 'Enter' && props.onSubmit) {
                props.onSubmit()
                e.preventDefault()
              }
            }
          }}
          label="Fallback"
          fullWidth
          autoFocus
          margin="normal"
          value={props.fallback}
          onChange={e => props.onFallbackChange(e.target.value)}
          placeholder={`If we can't find ${title}`}
        />
      </div>
    </Paper>
  )
}
