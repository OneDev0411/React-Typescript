import { Tooltip } from '@material-ui/core'
import { mdiLightningBolt } from '@mdi/js'
import styled from 'styled-components'

import AddToFlowButton from 'components/AddToFlowButton'
import ALinkToClosable from 'components/ALinkToClosable'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import CellContainer from './CellContainer'

const commonStyle = `
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  > svg {
    width: 1em;
    height: 1em;
    margin-right: 0.25rem;
  }
`
const Link = styled(ALinkToClosable)`
  ${commonStyle}
  &:hover {
    text-decoration: none;
  }
`

const AddFlow = styled.span`
  ${commonStyle}
`

//----

interface Props {
  contact: IContact
  callback: () => void
  flowsCount: number
}

const FlowsCell = ({ contact, callback, flowsCount }: Props) => {
  const renderCellContent = () => {
    if (flowsCount === 0) {
      return (
        <AddToFlowButton
          contacts={{ ids: [contact.id] }}
          callback={callback}
          buttonRenderer={buttonProps => (
            <Tooltip title="Add to flow">
              <AddFlow {...buttonProps}>
                <SvgIcon size={muiIconSizes.small} path={mdiLightningBolt} />+
              </AddFlow>
            </Tooltip>
          )}
        />
      )
    }

    const params = new URL(document.location).searchParams

    return (
      <Link
        noStyle
        to={{
          pathname: `/dashboard/contacts/${contact.id}`,
          state: {
            id: contact.id,
            s: parseInt(params.get('s'), 10)
          }
        }}
      >
        <SvgIcon size={muiIconSizes.small} path={mdiLightningBolt} />
        {flowsCount}
      </Link>
    )
  }

  return (
    <CellContainer
      enableActions={false}
      renderCellContent={renderCellContent}
    />
  )
}

export default FlowsCell
