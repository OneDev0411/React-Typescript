import React, { useState, useEffect, useCallback } from 'react'
import { CircularProgress, Button } from '@material-ui/core'

import OverlayDrawer from 'components/OverlayDrawer'
import Search from 'components/Grid/Search'

import { Neighborhood, NeighborhoodsReport } from './types'
import { getNeighborhoods, getReport } from './api'
import NeighborhoodsList from './NeighborhoodsList'
import ReportSelector from './ReportSelector'
import { getFormattedReportWithNeededPeriods } from './helpers'

const DEFAULT_TITLE = 'Search for a neighborhood'

interface Props {
  isOpen: boolean
  onlyAggregatedReports?: boolean
  onClose?: () => void
  onSelect: (report: Nullable<NeighborhoodsReport>) => void
}

export default function NeighborhoodsReportDrawer({
  isOpen,
  onlyAggregatedReports = false,
  onClose = () => {},
  onSelect
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [title, setTitle] = useState<string>(DEFAULT_TITLE)
  const [input, setInput] = useState<string>('')
  const [neighborhoods, setNeighborhoods] = useState<Nullable<Neighborhood[]>>(
    null
  )
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<
    Nullable<Neighborhood>
  >(null)
  const [report, setReport] = useState<Nullable<NeighborhoodsReport>>(null)
  const [selectedReport, setSelectedReport] = useState<
    Nullable<NeighborhoodsReport>
  >(null)

  const resetState = useCallback(() => {
    setInput('')
    setIsSearching(false)
    setIsLoading(false)
    setTitle(DEFAULT_TITLE)
    setNeighborhoods(null)
    setSelectedNeighborhood(null)
    setReport(null)
    setSelectedReport(null)
  }, [])

  useEffect(() => {
    if (!input) {
      resetState()

      return
    }

    async function fetchNeighborhoods() {
      setIsSearching(true)
      setIsLoading(true)

      const fetchedNeighborhoods = await getNeighborhoods(input)

      setNeighborhoods(fetchedNeighborhoods)
      setIsSearching(false)
      setIsLoading(false)
    }

    fetchNeighborhoods()
  }, [input, resetState])

  useEffect(() => {
    if (!selectedNeighborhood) {
      return
    }

    async function fetchNeighborhoodsReport() {
      if (!selectedNeighborhood) {
        return
      }

      setIsLoading(true)

      const fetchedReport = await getReport(selectedNeighborhood.id)
      const formattedReportWithAggregations = getFormattedReportWithNeededPeriods(
        fetchedReport,
        onlyAggregatedReports
      )

      setReport(formattedReportWithAggregations)
      setIsLoading(false)
    }

    fetchNeighborhoodsReport()
  }, [onlyAggregatedReports, selectedNeighborhood])

  const handleSearchInputChange = (value: string) => {
    const trimmedValue = value.trim()

    setInput(trimmedValue)
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const handleSelectReportSubset = (reportSubset: NeighborhoodsReport) => {
    setSelectedReport(reportSubset)
  }

  const handleSelectReport = () => {
    onSelect(selectedReport)
    resetState()
  }

  const handleSelectNeighborhood = (neighborhood: Neighborhood) => {
    setSelectedNeighborhood(neighborhood)
    setTitle(neighborhood.label)
  }

  return (
    <OverlayDrawer open={isOpen} onClose={handleClose}>
      <OverlayDrawer.Header title={title} />
      <OverlayDrawer.Body>
        <Search
          onChange={handleSearchInputChange}
          placeholder="Highland Park"
          isSearching={isSearching}
          debounceTime={800}
          showLoadingOnSearch
          style={{
            margin: '1.5rem 0'
          }}
        />
        {isLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <CircularProgress />
          </div>
        )}
        {!isLoading && !selectedNeighborhood && neighborhoods && (
          <NeighborhoodsList
            neighborhoods={neighborhoods}
            onItemClick={handleSelectNeighborhood}
          />
        )}
        {!isLoading && selectedNeighborhood && report && (
          <ReportSelector
            neighborhoodReport={report}
            onChange={handleSelectReportSubset}
          />
        )}
      </OverlayDrawer.Body>
      <OverlayDrawer.Footer rowReverse>
        <Button
          disabled={isLoading || !selectedReport}
          color="primary"
          variant="contained"
          onClick={handleSelectReport}
        >
          Insert Report
        </Button>
      </OverlayDrawer.Footer>
    </OverlayDrawer>
  )
}
