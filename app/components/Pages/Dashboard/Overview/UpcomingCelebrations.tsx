import React from 'react'
import Box from '@material-ui/core/Box'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'

import { Avatar } from 'components/Avatar'
import Link from 'components/ALink'

const useStyles = makeStyles(
  (theme: Theme) => ({
    item: {
      marginBottom: theme.spacing(3),
      '&:last-child': {
        marginBottom: 0
      }
    },
    itemDetails: {
      marginLeft: theme.spacing(2)
    },
    text: {
      lineHeight: 1.25
    }
  }),
  { name: 'ContactsList' }
)

interface ItemProps {
  title: string
  date: string
  lastTouch: string
  photo: string
  contact: string
}

const upcomingCelebrations: ItemProps[] = [
  {
    title: "Sarah Bloom's 3rd Home Anniversary",
    date: 'October 20',
    lastTouch: 'October 18, 2020',
    photo:
      'https://d2dzyv4cb7po1i.cloudfront.net/448e6bd1-cc8c-4076-8481-8897b5142dba/b5bdbfb0-1141-11eb-884e-77670024b14d.jpg',
    contact: '6f3d69ed-ff48-4d8e-ae8c-85d4e7313d25'
  },
  {
    title: 'Daniel Baker, Birthday',
    date: 'October 24',
    lastTouch: 'October 10, 2020',
    photo:
      'https://d2dzyv4cb7po1i.cloudfront.net/448e6bd1-cc8c-4076-8481-8897b5142dba/90bf4fb0-1143-11eb-884e-77670024b14d.jpg',
    contact: '3ff913cf-d688-4903-a4bb-df60cee0a9bd'
  },
  {
    title: "Jennifer Reed's 2rd Home Anniversary",
    date: 'October 25',
    lastTouch: 'August 2, 2020',
    photo:
      'https://d2dzyv4cb7po1i.cloudfront.net/448e6bd1-cc8c-4076-8481-8897b5142dba/f7005fd0-1143-11eb-884e-77670024b14d.jpg',
    contact: 'd4212fd8-fbf6-4927-bf88-5d7ab98b8389'
  }
]

export default function UpcomingCelebrations() {
  const classes = useStyles()

  return (
    <List>
      {upcomingCelebrations.map(
        ({ title, date, lastTouch, photo, contact }: ItemProps, index) => (
          <Box display="flex" key={index} className={classes.item}>
            <Avatar url={photo} size="large" />
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              className={classes.itemDetails}
              width="100%"
            >
              <Link noStyle to={`/dashboard/contacts/${contact}`} width="70%">
                <Box display="flex" flexDirection="column" width="100%">
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    className={classes.text}
                  >
                    {date}
                  </Typography>
                  <Typography noWrap variant="button" className={classes.text}>
                    {title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    className={classes.text}
                  >
                    Last touch: {lastTouch}
                  </Typography>
                </Box>
              </Link>
              <Button variant="outlined" size="small">
                Send Card
              </Button>
            </Box>
          </Box>
        )
      )}
    </List>
  )
}
