import { Tooltip } from '@material-ui/core'
import { mdiLightningBolt } from '@mdi/js'
import styled from 'styled-components'

import AddToFlowButton from 'components/AddToFlowButton'
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

    return <>{`in ${flowsCount} flow${flowsCount === 1 ? '' : 's'}`}</>
  }

  return <CellContainer renderCellContent={renderCellContent} />
}

export default FlowsCell
