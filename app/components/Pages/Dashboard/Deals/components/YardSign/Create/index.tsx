import React, { useState, ChangeEvent } from 'react'

import {
  Button,
  TextField,
  Checkbox,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { createRequestTask } from 'actions/deals/helpers/create-request-task'
import { createTaskComment } from 'deals/utils/create-task-comment'
import { getActiveChecklist } from 'models/Deal/helpers/get-active-checklist'
import { IAppState } from 'reducers'
import { getBrandChecklistsById } from 'reducers/deals/brand-checklists'
import { getDealChecklists } from 'reducers/deals/checklists'
import { selectUser } from 'selectors/user'

const ITEMS = [
  'Coming soon',
  'Include coming soon rider',
  'Put out a sign',
  'Pick up a sign',
  'Adjustments'
]

interface StateProps {
  user: IUser
  checklists: IDealChecklist[]
  brandChecklists: IBrandChecklist[]
}

interface Props {
  deal: IDeal
  onCreateTask(task: IDealTask): void
}

interface DispatchProps {
  createRequestTask: IAsyncActionProp<typeof createRequestTask>
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    buttonContainer: {
      margin: theme.spacing(1)
    },
    input: {
      margin: theme.spacing(1)
    },
    buttonLabel: {
      justifyContent: 'flex-start'
    }
  })
})

function Form(props: Props & StateProps & DispatchProps) {
  const classes = useStyles()

  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false)
  const [comment, setComment] = useState<string>('')

  const onChangeComment = (e: ChangeEvent<HTMLInputElement>) =>
    setComment(e.target.value)

  const toggleItem = (index: number): void => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter(item => item !== index))

      return
    }

    setSelectedItems([...selectedItems, index])
  }

  const handleCreateYardSign = async (): Promise<void> => {
    const checklist = getActiveChecklist(
      props.deal,
      props.brandChecklists,
      props.checklists,
      props.deal.deal_type
    )!

    setIsCreatingTask(true)

    const list = selectedItems.map(index => ITEMS[index])

    const task = await props.createRequestTask({
      checklist,
      userId: props.user.id,
      dealId: props.deal.id,
      taskType: 'YardSign',
      taskTitle: `Yard Sign: ${list.join(', ')}`,
      taskComment: `Please order a yard sign for this listing:\n${list.join(
        '\n'
      )}`,
      notifyMessage: 'Back office has been notified'
    })

    if (task && comment) {
      createTaskComment(task, props.user.id, comment)
    }

    setIsCreatingTask(false)

    if (task) {
      props.onCreateTask(task as any)
    }
  }

  return (
    <>
      {ITEMS.map((name, index) => (
        <div key={index}>
          <Button
            fullWidth
            classes={{
              label: classes.buttonLabel
            }}
            disabled={isCreatingTask}
            onClick={() => toggleItem(index)}
          >
            <Checkbox checked={selectedItems.includes(index)} /> {name}
          </Button>
        </div>
      ))}

      <TextField
        label="Special Instructions"
        margin="normal"
        variant="outlined"
        multiline
        rowsMax="2"
        value={comment}
        onChange={onChangeComment}
        className={classes.input}
      />

      <div className={classes.buttonContainer}>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          disabled={isCreatingTask || selectedItems.length === 0}
          onClick={handleCreateYardSign}
        >
          {isCreatingTask ? 'Creating...' : 'Request Yard Sign'}
        </Button>
      </div>
    </>
  )
}

function mapStateToProps(state: IAppState, { deal }: Props): StateProps {
  return {
    user: selectUser(state),
    checklists: getDealChecklists(deal, state.deals.checklists),
    brandChecklists: getBrandChecklistsById(
      state.deals.brandChecklists,
      deal.brand.id
    )
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    createRequestTask: (...args: Parameters<typeof createRequestTask>) =>
      dispatch(createRequestTask(...args))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form)
