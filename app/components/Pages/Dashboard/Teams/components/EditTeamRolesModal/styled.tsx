import styled from 'styled-components'

import { grey } from 'views/utils/colors'

export const EditTeamRolesTable = styled.table`
  border: none;
  width: 100%;
  margin-bottom: 1.5rem;
  td {
    padding: 0 1rem;
  }
  tr:first-child td {
    padding: 1rem 1rem 0;
  }
`

export const EditTeamRolesTableHeader = styled.thead`
  th {
    padding: 1rem;
    white-space: nowrap;
    &:first-child {
      width: 40%;
    }
  }
  background: ${grey.A125};
  border-style: solid;
  border-color: ${grey.A300};
  border-width: 1px 0;
`
