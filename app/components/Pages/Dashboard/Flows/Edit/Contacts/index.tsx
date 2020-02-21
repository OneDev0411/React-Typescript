import React, { useState, useEffect, useCallback } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import LoadingContainer from 'components/LoadingContainer'

import { getEnrolledContacts } from '../../helpers'

import Item from './Item'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
      borderRadius: theme.shape.borderRadius
    }
  })
)

interface Props {
  flowId: UUID
  onStop: (flowInstanceId: UUID) => Promise<any>
  onContactClick: (contactId: UUID) => void
}

export default function Contacts({ flowId, onStop, onContactClick }: Props) {
  const classes = useStyles()
  const [contacts, setContacts] = useState<IContact[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadContacts() {
      if (!flowId) {
        return
      }

      setIsLoading(true)

      const contacts = await getEnrolledContacts(flowId)

      setContacts(contacts)

      setIsLoading(false)
    }

    loadContacts()
  }, [flowId])

  const stopHandler = useCallback(
    async (contact: IContact) => {
      const flowInstance: any = contact.flows!.find(
        (flow: any) => flow.origin_id === flowId
      )

      if (!flowInstance) {
        return
      }

      setIsLoading(true)
      await onStop(flowInstance.id)
      setContacts(contacts.filter(item => item.id !== contact.id))
      setIsLoading(false)
    },
    [contacts, flowId, onStop]
  )

  if (isLoading) {
    return <LoadingContainer style={{ padding: '20% 0' }} />
  }

  if (contacts.length === 0) {
    return (
      <Grid
        container
        item
        direction="column"
        justify="center"
        alignItems="center"
        style={{ height: '50vh' }}
      >
        <img
          src="/static/images/contacts/zero-state.svg"
          alt="no-contacts"
          style={{ marginBottom: '1rem' }}
        />
        <Typography variant="h5">You have no contacts yet!</Typography>
      </Grid>
    )
  }

  return (
    <Grid container item justify="center" alignItems="center" xs={12}>
      <Paper className={classes.paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary">Name</Typography>
              </TableCell>
              <TableCell>
                <Typography color="textPrimary">Contact</Typography>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map(contact => (
              <Item
                key={contact.id}
                contact={contact}
                onStop={stopHandler}
                onClick={onContactClick}
              />
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Grid>
  )
}
