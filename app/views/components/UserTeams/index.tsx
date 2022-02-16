import { useState, useEffect, useCallback } from 'react'

import { Button } from '@material-ui/core'
import pluralize from 'pluralize'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import { getTeams } from '@app/models/user/get-teams'
import Drawer from 'components/OverlayDrawer'
import { SearchContext } from 'components/TextWithHighlights'
import { getAgents } from 'models/Deal/agent'
import { isBackOffice } from 'utils/acl'
import { getBrandUsers } from 'utils/user-teams'

import Search from './Search'
import Team from './Team'

interface BrandWithMembers {
  brand: IBrand
  members: IUser[]
}

interface Props {
  user: IUser
  title?: string
  onSelectTeams(teams: UUID[]): Promise<void>
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
  const [filteredBrandsWithMembers, setFilteredBrandsWithMembers] = useState<
    BrandWithMembers[]
  >([])
  const activeTeam = useUnsafeActiveTeam()
  const [selectedBrands, setSelectedBrands] = useState<UUID[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function fetchBrandsWithMembers() {
      if (!activeTeam) {
        setBrandsWithMembers([])

        return
      }

      // We should send a req and get all child brands if the user is BO
      if (isBackOffice(activeTeam)) {
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

      const availableTeamToUser = await getTeams()

      setBrandsWithMembers(
        availableTeamToUser.map(team => {
          const brand = team.brand

          return {
            brand,
            members: getBrandUsers(brand)
          }
        })
      )
    }

    fetchBrandsWithMembers()
  }, [activeTeam])

  useEffect(() => {
    if (!searchQuery) {
      setFilteredBrandsWithMembers(brandsWithMembers)

      return
    }

    const formattedQuery = searchQuery.toLowerCase()

    setFilteredBrandsWithMembers(
      brandsWithMembers.filter(item => {
        if (item.brand.name.toLowerCase().includes(formattedQuery)) {
          return true
        }

        return item.members.some(member => {
          const searchFields = [member.display_name, member.email]

          return searchFields.some(field =>
            field.toLowerCase().includes(formattedQuery)
          )
        })
      })
    )
  }, [brandsWithMembers, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSelectTeams = async () => {
    setIsSaving(true)
    await onSelectTeams(selectedBrands)
    setIsSaving(false)
  }

  const handleToggleSelectAll = useCallback(() => {
    if (selectedBrands.length === brandsWithMembers.length) {
      setSelectedBrands([])

      return
    }

    setSelectedBrands(brandsWithMembers.map(item => item.brand.id))
  }, [brandsWithMembers, selectedBrands.length])

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
    if (isSaving) {
      return 'Saving...'
    }

    if (selectedBrands.length === 0) {
      return 'No teams selected'
    }

    return `Save for ${pluralize('team', selectedBrands.length, true)}`
  }, [isSaving, selectedBrands.length])

  const getToggleSelectAllButtonCopy = useCallback(() => {
    if (selectedBrands.length === brandsWithMembers.length) {
      return 'Deselect all'
    }

    return `Select all ${pluralize('team', brandsWithMembers.length, true)}`
  }, [brandsWithMembers.length, selectedBrands.length])

  return (
    <SearchContext.Provider value={searchQuery}>
      <Drawer open onClose={onClose}>
        <Drawer.Header title={title} />
        <Drawer.Body>
          <Search onChange={handleSearch} />
          {filteredBrandsWithMembers.map(({ brand, members }) => {
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
        <Drawer.Footer>
          <Button
            variant="text"
            color="primary"
            disabled={isSaving}
            onClick={handleToggleSelectAll}
          >
            {getToggleSelectAllButtonCopy()}
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={selectedBrands.length === 0 || isSaving}
            onClick={handleSelectTeams}
          >
            {getActionButtonCopy()}
          </Button>
        </Drawer.Footer>
      </Drawer>
    </SearchContext.Provider>
  )
}
