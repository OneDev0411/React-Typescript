import { NormalizedBrand } from 'components/TeamAgents/types'

export enum RowType {
  Header = 'HEADER',
  Agent = 'AGENT',
  Spacer = 'SPACER'
}

export type Row =
  | {
      type: RowType.Header
      name?: string
      subtitle?: string
    }
  | {
      type: RowType.Agent
      user: IUser
      office: NormalizedBrand
      isSelected: boolean
      multiSelection: boolean
    }
  | {
      type: RowType.Spacer
    }
