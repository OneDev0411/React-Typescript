import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import { NeighborhoodsReport } from 'components/NeighborhoodsReportDrawer/types'
import getStaticImageChartUrl from 'utils/charts/get-static-image-chart-url'

import NeighborhoodsIcon from 'assets/images/marketing/editor/blocks/neighborhoods.png'

import NeighborhoodsGraphsIcon from 'assets/images/marketing/editor/blocks/neighborhoods-graphs.png'

import { TemplateRenderData } from '../../../utils/get-template-render-data'
import registerBlock from '../../registerBlock'
import { MARKET_REPORTS_CATEGORY } from '../../../constants'

import neighborhoodsTemplates from './neighborhoods.mjml'
import neighborhoodsGraphsTemplates from './neighborhoods-graphs.mjml'
import { handleBlockDragStopEvent } from '../../utils'
import { adaptTemplates } from '../utils'

export const neighborhoodsBlockName = 'rechat-neighborhoods'
export const neighborhoodsGraphsBlockName = 'rechat-neighborhoods-graphs'

const templates = {
  [neighborhoodsBlockName]: neighborhoodsTemplates,
  [neighborhoodsGraphsBlockName]: neighborhoodsGraphsTemplates
}

export interface Options {
  onNeighborhoodsDrop: (model: Model) => void
  onNeighborhoodsGraphsDrop: (model: Model) => void
}

interface NeighborhoodsBlocks {
  selectHandler: (selectedReport?: NeighborhoodsReport) => void
}

function getNeighborhoodsGraphTemplateReport(
  selectedReport: NeighborhoodsReport,
  graphBarsBackgroundColor: string = '#4d89f9'
): any {
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
  { onNeighborhoodsDrop, onNeighborhoodsGraphsDrop }: Options
): NeighborhoodsBlocks {
  registerBlock(editor, {
    label: 'Neighborhoods',
    icon: NeighborhoodsIcon,
    category: MARKET_REPORTS_CATEGORY,
    blockName: neighborhoodsBlockName,
    template: templates[neighborhoodsBlockName],
    adaptive: true
  })

  registerBlock(editor, {
    label: 'Neighborhoods Graphs',
    icon: NeighborhoodsGraphsIcon,
    category: MARKET_REPORTS_CATEGORY,
    blockName: neighborhoodsGraphsBlockName,
    template: templates[neighborhoodsGraphsBlockName],
    adaptive: true
  })

  return handleBlockDragStopEvent(
    editor,
    adaptTemplates(templates),
    (selectedReport: NeighborhoodsReport, droppedBlockName: string) => ({
      ...renderData,
      report:
        droppedBlockName === neighborhoodsBlockName
          ? selectedReport
          : getNeighborhoodsGraphTemplateReport(
              selectedReport,
              renderData.get('inverted-container-bg-color')
            )
    }),
    (model: Model, blockId: string) => {
      if (blockId === neighborhoodsBlockName) {
        onNeighborhoodsDrop(model)
      } else if (blockId === neighborhoodsGraphsBlockName) {
        onNeighborhoodsGraphsDrop(model)
      }
    }
  )
}
