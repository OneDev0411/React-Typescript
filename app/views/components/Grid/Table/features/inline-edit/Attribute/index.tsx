import { useState } from 'react'

import { alpha, IconButton, Tooltip, makeStyles } from '@material-ui/core'
import cn from 'classnames'
import { omitBy } from 'lodash'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { CellAction } from '../../cells/CellContainer'

import EntryInlineForm from './inline-form'

const useStyles = makeStyles(
  theme => ({
    iconButton: {
      color: `${theme.palette.action.disabled} !important`,
      '&:hover': {
        color: `${theme.palette.tertiary.main} !important`
      }
    },
    attributeEditWidget: {
      boxSizing: 'border-box',
      boxShadow: `
        0px 0.3px 0.5px ${alpha(theme.palette.secondary.dark, 0.1)},
        0px 2px 4px ${alpha(theme.palette.secondary.dark, 0.2)}
      `,
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.primary.main}`,
      background: theme.palette.background.paper
    },
    attributeEntries: {
      display: 'flex',
      flexDirection: 'column'
    },
    phoneAttributeEntries: {
      minWidth: '342px'
    },
    emailAttributeEntries: {
      minWidth: '400px'
    },
    attributeEntry: ({ rowSize }: { rowSize: number }) => ({
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: theme.spacing(0.5),
      borderBottom: `1px solid ${theme.palette.divider}`,
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius,
      height: rowSize,

      '&:first-child': {
        height: rowSize - 1
      },
      '&:last-child': {
        height: rowSize - 1,

        borderBottomLeftRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius,
        borderBottom: 'none'
      },
      '&:only-child': {
        height: rowSize - 2
      },
      '&:hover': {
        backgroundColor: theme.palette.grey[50]
      }
    }),
    addNewAttributeEntry: {
      ...theme.typography.body2,
      color: theme.palette.primary.main,
      lineHeight: `${theme.spacing(3)}px`,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      alignItems: 'center',
      justifyContent: 'flex-start !important',
      borderBottom: 'none !important',
      cursor: 'pointer'
    },
    addAttributeButton: {
      ...theme.typography.body2,
      textAlign: 'right',
      minWidth: '56px',
      justifyContent: 'right',
      lineHeight: `${theme.spacing(3)}px`,
      color: theme.palette.primary.main,
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    }
  }),
  { name: 'AttributeInlineEdit' }
)

interface Props {
  contactAttributes: IContactAttribute[]
  attributeType: 'email' | 'phone_number'
  attributeActions: Record<string, CellAction>
  attributeInputPlaceholder: string
  attributeDescription: string
  valueFormatter?: (value: string) => string
  rowSize?: number
}

export default function AttributeInlineEdit({
  contactAttributes,
  attributeType,
  attributeActions,
  attributeInputPlaceholder,
  attributeDescription,
  valueFormatter,
  rowSize = 40
}: Props) {
  const classes = useStyles({ rowSize })

  const [inAddMode, setInAddMode] = useState(false)
  const toggleAddMode = () => setInAddMode(prevMode => !prevMode)

  const ActionButton = (
    title: string,
    index: number,
    { onClick, iconPath, tooltipText = '' }: CellAction
  ) => (
    <Tooltip title={tooltipText} placement="bottom" key={`${title}-${index}`}>
      <IconButton className={classes.iconButton} size="small" onClick={onClick}>
        <SvgIcon path={iconPath} size={muiIconSizes.small} />
      </IconButton>
    </Tooltip>
  )

  const AttributeEntry = ({
    attribute,
    attributeIndex,
    attributeCategory = 'text'
  }) => {
    const entryActions: Record<string, CellAction> = omitBy(
      attributeActions,
      (v, k) => k === 'edit'
    )
    const actionButtons = Object.keys(entryActions).map((name, index) =>
      ActionButton(name, index, entryActions[name])
    )

    return (
      <div className={classes.attributeEntry} key={attributeIndex}>
        <EntryInlineForm
          value={attribute[attributeCategory]}
          label={attribute.label}
          type={attributeType}
          actions={actionButtons}
          inputPlaceholder={attributeInputPlaceholder}
          valueFormatter={valueFormatter}
        />
      </div>
    )
  }

  const AddNewAttribute = () => {
    const showEmptyForm = contactAttributes.length === 0 || inAddMode
    const showAppendForm = !showEmptyForm && contactAttributes.length > 0

    const AddButton = () => (
      <div className={classes.addAttributeButton} onClick={toggleAddMode}>
        Add
      </div>
    )

    return (
      <div
        className={cn(classes.attributeEntry, {
          [classes.addNewAttributeEntry]: showAppendForm
        })}
        {...(showAppendForm ? { onClick: toggleAddMode } : {})}
      >
        {showEmptyForm && (
          <EntryInlineForm
            value=""
            label=""
            type={attributeType}
            actions={AddButton()}
            inputPlaceholder={attributeInputPlaceholder}
            valueFormatter={valueFormatter}
          />
        )}
        {showAppendForm && `Add ${attributeDescription}`}
      </div>
    )
  }

  return (
    <div className={classes.attributeEditWidget}>
      <div
        className={cn(classes.attributeEntries, {
          [classes.phoneAttributeEntries]: attributeType === 'phone_number',
          [classes.emailAttributeEntries]: attributeType === 'email'
        })}
      >
        {contactAttributes.length > 0 &&
          contactAttributes.map((attribute, attributeIndex) =>
            AttributeEntry({
              attribute,
              attributeIndex
            })
          )}
        {AddNewAttribute()}
      </div>
    </div>
  )
}
