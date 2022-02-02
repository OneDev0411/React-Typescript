import { Model } from 'backbone'
import { Editor } from 'grapesjs'

import NeighborhoodsGraphsIcon from 'assets/images/marketing/editor/blocks/neighborhoods-graphs.png'
import NeighborhoodsIcon from 'assets/images/marketing/editor/blocks/neighborhoods.png'
import { NeighborhoodsReport } from 'components/NeighborhoodsReportDrawer/types'
import getStaticImageChartUrl from 'utils/charts/get-static-image-chart-url'

import { MARKET_REPORTS_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'
import registerBlock from '../../registerBlock'
import { registerTemplateBlocks } from '../../templateBlocks'
import { RegisterBlockSelectHandler, TemplateBlockOptions } from '../../types'
import { handleBlockDragStopEvent } from '../../utils'

import neighborhoodsGraphsTemplates from './neighborhoods-graphs.mjml'
import neighborhoodsTemplates from './neighborhoods.mjml'

export const neighborhoodsBlockName = 'rechat-neighborhoods'
export const neighborhoodsGraphsBlockName = 'rechat-neighborhoods-graphs'

interface NeighborhoodsRenderData {
  report: NeighborhoodsReport
}

export interface Options {
  onNeighborhoodsDrop: (model: Model) => void
  onNeighborhoodsGraphsDrop: (model: Model) => void
}

function getNeighborhoodsGraphTemplateReport(
  selectedReport: NeighborhoodsReport,
  graphBarsBackgroundColor: string = '#4d89f9'
): NeighborhoodsReport {
  return {
    ...selectedReport,
    metrics: selectedReport.metrics.map(metric => {
      const metricType = metric.type

      return {
        ...metric,
        data: metric.data.map(metricData => {
          const labels = metricData.aggregateOf!.map(
            aggregatedItem => aggregatedItem.label
          )

          // eslint-disable-next-line max-len
          const title = `${metric.name} ${metricData.label} in ${selectedReport.neighborhood.label}`

          const datasets = [
            {
              label: title,
              data: metricData.aggregateOf!.map(aggregatedItem => {
                const rawItemValue = aggregatedItem.value.toString()
                let itemValue = Number(rawItemValue)

                if (metricType === 'percent') {
                  itemValue = Number(
                    rawItemValue.slice(0, rawItemValue.length - 1)
                  )
                }

                return itemValue
              }),
              backgroundColor: graphBarsBackgroundColor
            }
          ]

          return {
            ...metricData,
            chartUrl: getStaticImageChartUrl({
              type: 'bar',
              data: {
                labels,
                datasets
              },
              options: {
                legend: {
                  display: false
                },
                scales: {
                  xAxes: [
                    {
                      gridLines: {
                        color: 'transparent',
                        zeroLineColor: '#ccc'
                      }
                    }
                  ],
                  yAxes: [
                    {
                      gridLines: {
                        color: 'transparent'
                      },
                      ticks: {
                        beginAtZero: true
                      }
                    }
                  ]
                }
              }
            })
          }
        })
      }
    })
  }
}

export default function registerNeighborhoodsBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlockOptions: TemplateBlockOptions,
  { onNeighborhoodsDrop, onNeighborhoodsGraphsDrop }: Options
): RegisterBlockSelectHandler<NeighborhoodsReport> {
  const neighborhoodBlocks = {
    [neighborhoodsBlockName]:
      templateBlockOptions.blocks[neighborhoodsBlockName]?.template ||
      neighborhoodsTemplates,
    [neighborhoodsGraphsBlockName]:
      templateBlockOptions.blocks[neighborhoodsGraphsBlockName]?.template ||
      neighborhoodsGraphsTemplates
  }

  registerBlock(
    editor,
    {
      label: 'Neighborhoods',
      icon: NeighborhoodsIcon,
      category: MARKET_REPORTS_CATEGORY,
      blockName: neighborhoodsBlockName,
      template: neighborhoodBlocks[neighborhoodsBlockName],
      adaptive: true
    },
    templateBlockOptions
  )

  registerBlock(
    editor,
    {
      label: 'Neighborhoods Graphs',
      icon: NeighborhoodsGraphsIcon,
      category: MARKET_REPORTS_CATEGORY,
      blockName: neighborhoodsGraphsBlockName,
      template: neighborhoodBlocks[neighborhoodsGraphsBlockName],
      adaptive: true
    },
    templateBlockOptions
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Neighborhoods',
    neighborhoodBlocks,
    templateBlockOptions.blocks
  )

  return handleBlockDragStopEvent<NeighborhoodsReport, NeighborhoodsRenderData>(
    editor,
    allBlocks,
    (selectedReport, droppedBlockName) => ({
      ...renderData,
      report:
        droppedBlockName === neighborhoodsBlockName
          ? selectedReport
          : getNeighborhoodsGraphTemplateReport(
              selectedReport,
              renderData.get('inverted-container-bg-color')
            )
    }),
    (model, blockId) => {
      if (blockId === neighborhoodsBlockName) {
        onNeighborhoodsDrop(model)
      } else if (blockId === neighborhoodsGraphsBlockName) {
        onNeighborhoodsGraphsDrop(model)
      }
    }
  )
}
