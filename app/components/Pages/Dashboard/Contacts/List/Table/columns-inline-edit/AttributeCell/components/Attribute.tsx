import { ReactNode } from 'react'

import { InputBase, NativeSelect, makeStyles, Theme } from '@material-ui/core'
import { mdiContentCopy, mdiTrashCanOutline } from '@mdi/js'

import { SvgIcon, muiIconSizes } from '@app/views/components/SvgIcons'

interface Props {
  labels: string[]
  values: {
    value: string
    label: string
  }
  actions?: ReactNode
  onAdd: () => void
  onDelete: () => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '100%',
      display: 'flex',
      padding: theme.spacing(1, 2),
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    valuesContainer: {
      display: 'flex',
      paddingRight: theme.spacing(1),
      alignItems: 'center',
      flexGrow: 1
    },
    value: {
      // background: 'red',
      flexGrow: 1
    },
    label: {
      // background: 'blue'
    },
    actionContainer: {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.action.disabled
    },
    customActionContainer: {
      marginRight: theme.spacing(0.5)
    },
    actionButton: {
      cursor: 'pointer',
      '&:not(:last-child)': {
        marginRight: theme.spacing(0.5)
      }
    }
  }),
  {
    name: 'AttributeCell'
  }
)

export function Attribute({ actions }: Partial<Props>) {
  const classes = useStyles()

  const handleCopyAttribute = () => {
    console.log('handleCopyAttribute')
  }
  const handleRemoveAttribute = () => {
    console.log('handleRemoveAttribute')
  }

  return (
    <div className={classes.container}>
      <div className={classes.valuesContainer}>
        <InputBase name="value" margin="none" className={classes.value} />
        <NativeSelect id="select" className={classes.label}>
          <option value="22">test</option>
          <option value="33">test 2</option>
        </NativeSelect>
      </div>
      <div className={classes.actionContainer}>
        {actions && (
          <div className={classes.customActionContainer}>{actions}</div>
        )}
        <div className={classes.actionButton} onClick={handleCopyAttribute}>
          <SvgIcon path={mdiContentCopy} size={muiIconSizes.small} />
        </div>
        <div className={classes.actionButton} onClick={handleRemoveAttribute}>
          <SvgIcon path={mdiTrashCanOutline} size={muiIconSizes.small} />
        </div>
      </div>
    </div>
  )
}
