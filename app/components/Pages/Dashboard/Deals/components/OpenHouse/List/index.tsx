import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import {
  Button,
  IconButton,
  Typography,
  Tooltip,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'
import fecha from 'fecha'

import { IAppState } from 'reducers/index'
import { selectDealTasks } from 'reducers/deals/tasks'

import { Divider } from 'components/Divider'

import LoadingContainer from 'components/LoadingContainer'

import IconWebLink from 'components/SvgIcons/Weblink/IconWebLink'
import IconDelete from 'components/SvgIcons/Trash/TrashIcon'

import config from '../../../../../../../../config/public'

type OpenHouse = ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>

interface StateProps {
  user: IUser
  tasks: IDealTask[]
}

interface Props {
  deal: IDeal
  list: OpenHouse[]
  isFetching: boolean
  activeTeamId: UUID | null
  onClickNewItem(): void
  onSelectItem(task: OpenHouse): void
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      '& a, & button': {
        zIndex: 1,
        position: 'relative'
      }
    },
    buttonLabel: {
      alignItems: 'flex-start',
      flexDirection: 'column'
    },
    itemContainer: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      padding: theme.spacing(1, 3),
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      }
    },
    date: {
      color: theme.palette.grey.A700
    },
    actions: {
      marginLeft: theme.spacing(3)
    },
    iconButton: {
      marginLeft: theme.spacing(1)
    },
    clickableArea: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      opacity: 0,
      width: '100%'
    }
  })
})

function List(props: Props & StateProps) {
  const classes = useStyles()

  const dealOpenHousesList = useMemo(() => {
    return props.list.filter(item =>
      (item.associations || []).some(
        association =>
          association.association_type === 'deal' &&
          association.deal!.id === props.deal.id
      )
    )
  }, [props.deal.id, props.list])

  /**
   * opens the open house registration link
   * @param oh - the open house object
   */
  const handleOpenRegistrationPage = (oh: OpenHouse): void => {
    const registerPageURL = `${config.app.url}/openhouse/${oh.id}/${
      props.activeTeamId
    }/register`

    window.open(registerPageURL)
  }

  const handleDelete = (oh: OpenHouse): void => {
    alert('')
  }

  return (
    <div className={classes.root}>
      <Button
        fullWidth
        color="primary"
        size="large"
        classes={{
          label: classes.buttonLabel
        }}
        onClick={props.onClickNewItem}
      >
        Create New Open House
      </Button>
      <Divider />

      {props.isFetching ? (
        <LoadingContainer size="3rem" style={{ padding: 0 }} />
      ) : (
        dealOpenHousesList.map(oh => (
          <div key={oh.id}>
            <div className={classes.itemContainer}>
              <Typography variant="body1">
                <Flex justifyBetween>
                  <Flex>
                    {fecha.format(
                      new Date(oh.created_at * 1000),
                      'dddd, MMMM D, YYYY - hh:mmA'
                    )}
                  </Flex>

                  <Flex className={classes.actions}>
                    <Tooltip title="Open Client Registration Page">
                      <IconButton
                        size="small"
                        className={classes.iconButton}
                        onClick={() => handleOpenRegistrationPage(oh)}
                      >
                        <IconWebLink />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        className={classes.iconButton}
                        onClick={() => handleDelete(oh)}
                      >
                        <IconDelete />
                      </IconButton>
                    </Tooltip>
                  </Flex>
                </Flex>
              </Typography>
              <Typography variant="body1" className={classes.date}>
                {oh.title}
              </Typography>

              <div
                type="button"
                onClick={() => props.onSelectItem(oh)}
                className={classes.clickableArea}
              />
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function mapStateToProps(
  { user, deals }: IAppState,
  ownProps: Props
): StateProps {
  return {
    user,
    tasks: selectDealTasks(ownProps.deal, deals.checklists, deals.tasks)
  }
}

export default connect(mapStateToProps)(List)
