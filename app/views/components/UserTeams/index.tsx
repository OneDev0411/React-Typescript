import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@material-ui/core'
import pluralize from 'pluralize'

import Drawer from 'components/OverlayDrawer'

import { getAgents } from 'models/Deal/agent'
import { getBrandUsers, isBackOffice, getActiveTeam } from 'utils/user-teams'

import Team from './Team'

interface BrandWithMembers {
  brand: IBrand
  members: IUser[]
}

interface Props {
  user: IUser
  title?: string
  onSelectTeams(teams: UUID[]): void
  onClose(): void
}

export default function UserTeams({
  user,
  title = 'Select Teams',
  onClose,
  onSelectTeams
}: Props) {
  const [brandsWithMembers, setBrandsWithMembers] = useState<
    BrandWithMembers[]
  >([])
  const [selectedBrands, setSelectedBrands] = useState<UUID[]>([])

  useEffect(() => {
    async function fetchBrandsWithMembers() {
      if (!user.teams) {
        setBrandsWithMembers([])

        return
      }

      // We should send a req and get all child brands if the user is BO
      if (isBackOffice(user)) {
        const activeTeam = getActiveTeam(user)

        if (!activeTeam) {
          setBrandsWithMembers([])

          return
        }

        const allAccessibleBrands: IBrand[] = await getAgents(
          activeTeam.brand.id
        )

        setBrandsWithMembers(
          allAccessibleBrands.map(brand => {
            return {
              brand,
              members: getBrandUsers(brand)
            }
          })
        )

        return
      }

      setBrandsWithMembers(
        user.teams.map(team => {
          const brand = team.brand

          return {
            brand,
            members: getBrandUsers(brand)
          }
        })
      )
    }

    fetchBrandsWithMembers()
  }, [user, user.teams])

  const handleSelectChange = useCallback(
    (brand: IBrand) => {
      if (selectedBrands.includes(brand.id)) {
        setSelectedBrands(selectedBrands.filter(id => id !== brand.id))

        return
      }

      setSelectedBrands([...selectedBrands, brand.id])
    },
    [selectedBrands]
  )

  const getActionButtonCopy = useCallback(() => {
    if (selectedBrands.length === 0) {
      return 'No teams selected'
    }

    return `Save for ${pluralize('team', selectedBrands.length, true)}`
  }, [selectedBrands.length])

  return (
    <Drawer open onClose={onClose}>
      <Drawer.Header title={title} />
      <Drawer.Body>
        {brandsWithMembers.map(({ brand, members }) => {
          const isSelected = selectedBrands.includes(brand.id)

          return (
            <Team
              key={`${brand.id}-${isSelected}`}
              brand={brand}
              members={members}
              isSelected={isSelected}
              onSelectChange={handleSelectChange}
            />
          )
        })}
      </Drawer.Body>
      <Drawer.Footer style={{ flexDirection: 'row-reverse' }}>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedBrands.length === 0}
          onClick={() => onSelectTeams(selectedBrands)}
        >
          {getActionButtonCopy()}
        </Button>
      </Drawer.Footer>
    </Drawer>
  )
}
