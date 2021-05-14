import { Checkbox, Avatar } from '@material-ui/core'

import { TextWithHighlights } from 'components/TextWithHighlights'
import { BrandedUser } from 'components/TeamAgents/types'

import { Row, RowType } from '../types'

import {
  AgentEmail,
  AgentTitle,
  Header,
  RowItem,
  SubTitle,
  Title
} from '../List/styled'

interface Props {
  index: number
  style: React.CSSProperties
  data: {
    onSelectAgent: (agent: BrandedUser) => void
    searchCriteria: string
    rows: Row[]
  }
}

export function ListRow({
  index,
  style,
  data: { rows, searchCriteria, onSelectAgent }
}: Props) {
  const row = rows[index]

  if (row.type === RowType.Header) {
    return (
      <Header style={style}>
        <Title>
          <TextWithHighlights search={searchCriteria}>
            {row.name || ''}
          </TextWithHighlights>
        </Title>
        <SubTitle>{row.subtitle}</SubTitle>
      </Header>
    )
  }

  if (row.type === RowType.Agent) {
    return (
      <RowItem
        style={style}
        isLastRow={rows[index + 1]?.type === RowType.Spacer}
        onClick={() =>
          onSelectAgent({
            ...row.user,
            brand_id: row.office.id
          })
        }
      >
        {row.multiSelection && (
          <Checkbox
            color="primary"
            style={{
              padding: 0,
              marginRight: '1rem'
            }}
            checked={row.isSelected}
          />
        )}

        <Avatar
          src={row.user.profile_image_url!}
          alt={row.user.display_name}
          style={{
            marginRight: '1rem'
          }}
        >
          {row.user.display_name[0]}
        </Avatar>

        <div>
          <AgentTitle to="">
            <TextWithHighlights search={searchCriteria}>
              {row.user.display_name}
            </TextWithHighlights>
          </AgentTitle>

          <AgentEmail>
            <TextWithHighlights search={searchCriteria}>
              {row.user.email}
            </TextWithHighlights>
          </AgentEmail>
        </div>
      </RowItem>
    )
  }

  return <div style={style} />
}
