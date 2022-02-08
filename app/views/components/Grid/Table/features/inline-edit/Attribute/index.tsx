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
      borderRadius: theme.spacing(0.5),
      border: `1px solid ${theme.palette.primary.main}`,
      background: theme.palette.background.paper,
      position: 'absolute',
      zIndex: 10,
      left: 0,
      top: 0
    },
    attributeEntries: {
      display: 'flex',
      flexDirection: 'column',

      '&.phone_number': {
        minWidth: theme.spacing(42.75)
      },
      '&.email': {
        minWidth: theme.spacing(50)
      }
    },
    attributeEntry: {
      display: 'flex',
      flexDirection: 'row',
      borderBottom: `1px solid ${theme.palette.divider}`,
      justifyContent: 'flex-end',
      gap: theme.spacing(0.5),
      borderTopLeftRadius: theme.spacing(0.5),
      borderTopRightRadius: theme.spacing(0.5),
      height: theme.spacing(5),

      '&:first-child': {
        height: theme.spacing(5) - 1,

        '&.focused': {
          borderBottom: `1px solid ${theme.palette.primary.main}`
        }
      },
      '&:last-child': {
        height: theme.spacing(5) - 1,
        borderBottomLeftRadius: theme.spacing(0.5),
        borderBottomRightRadius: theme.spacing(0.5),
        borderBottom: 'none',

        '&.focused': {
          borderTop: `1px solid ${theme.palette.primary.main}`
        }
      },
      '&:only-child': {
        height: theme.spacing(5) - 2
      },
      '&:hover': {
        backgroundColor: theme.palette.grey[50]
      },

      '&.add-new': {
        ...theme.typography.body2,
        color: theme.palette.primary.main,
        letterSpacing: '0.15px',
        lineHeight: `${theme.spacing(3)}px`,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottom: 'none'
      }
    },
    addAttributeButton: {
      ...theme.typography.body2,
      letterSpacing: '0.15px',
      textAlign: 'right',
      minWidth: theme.spacing(7),
      justifyContent: 'right',
      lineHeight: `${theme.spacing(3)}px`,
      color: theme.palette.primary.main,
      display: 'flex',
      alignItems: 'center'
    }
  }),
  { name: 'Attribute-inline-edit' }
)

interface Props {
  contactAttributes: IContactAttribute[]
  attributeType: 'email' | 'phone_number'
  attributeActions: Record<string, CellAction>
  attributeInputPlaceholder: string
  attributeDescription: string
}

export default function AttributeInlineEdit({
  contactAttributes,
  attributeType,
  attributeActions,
  attributeInputPlaceholder,
  attributeDescription
}: Props) {
  const classes = useStyles()

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
          'add-new': showAppendForm
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
          />
        )}
        {showAppendForm && <>Add {attributeDescription}</>}
      </div>
    )
  }

  return (
    <div className={classes.attributeEditWidget}>
      <div className={cn(classes.attributeEntries, attributeType)}>
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
