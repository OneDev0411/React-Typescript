import { AccordionDetails, makeStyles } from '@material-ui/core'

import Acl from '@app/views/components/Acl'

import { BaseAccordionMenu } from '../types'

import { SideNavAccordionDetailsItem } from './SideNavAccordionDetailsItem'

const useStyles = makeStyles(
  theme => ({
    AccordionDetailsRoot: {
      margin: theme.spacing(0, 1, 0, 0),
      padding: 0,
      flexDirection: 'column'
    }
  }),
  {
    name: 'SideNavAccordionDetails'
  }
)

interface Props {
  isOpen: boolean
  subMenu: BaseAccordionMenu[]
}

export function SideNavAccordionDetails({ isOpen, subMenu }: Props) {
  const classes = useStyles()

  return (
    <AccordionDetails
      classes={{
        root: classes.AccordionDetailsRoot
      }}
    >
      {subMenu.map((item, index) => {
        const { access, isHidden } = item

        if (isHidden) {
          return null
        }

        return access ? (
          <Acl access={access} key={index}>
            <SideNavAccordionDetailsItem item={item} isOpen={isOpen} />
          </Acl>
        ) : (
          <SideNavAccordionDetailsItem
            item={item}
            isOpen={isOpen}
            key={index}
          />
        )
      })}
    </AccordionDetails>
  )
}
