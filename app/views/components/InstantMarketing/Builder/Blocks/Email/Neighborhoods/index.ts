import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'
import { NeighborhoodsReport } from 'components/NeighborhoodsReportDrawer/types'
import getStaticImageChartUrl from 'utils/charts/get-static-image-chart-url'

import { TemplateRenderData } from '../../../utils/get-template-render-data'
import registerBlock from '../../registerBlock'
import adapt from '../../adapt'
import { MARKET_REPORTS_CATEGORY } from '../../../constants'

import neighborhoodsTemplates from './neighborhoods.mjml'
import neighborhoodsGraphsTemplates from './neighborhoods-graphs.mjml'

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
    category: MARKET_REPORTS_CATEGORY,
    blockName: neighborhoodsBlockName,
    template: templates[neighborhoodsBlockName],
    adaptive: true
  })

  registerBlock(editor, {
    label: 'Neighborhoods Graphs',
    category: MARKET_REPORTS_CATEGORY,
    blockName: neighborhoodsGraphsBlockName,
    template: templates[neighborhoodsGraphsBlockName],
    adaptive: true
  })

  let modelHandle: any

  const selectHandler = (selectedReport?: NeighborhoodsReport) => {
    if (!modelHandle) {
      return
    }

    const parent = modelHandle.parent()

    if (selectedReport) {
      const droppedBlockName = modelHandle.attributes.attributes['data-block']

      const report =
        droppedBlockName === neighborhoodsBlockName
          ? selectedReport
          : getNeighborhoodsGraphTemplateReport(
              selectedReport,
              renderData.get('inverted-container-bg-color')
            )

      const template = templates[droppedBlockName]

      const mjml = nunjucks.renderString(adapt(parent, template), {
        ...renderData,
        report
      })

      parent.append(mjml, { at: modelHandle.opt.at })
    }

    modelHandle.remove()
  }

  editor.on('block:drag:stop', (model: Model, block: any) => {
    if (!model) {
      return
    }

    if (block.id === neighborhoodsBlockName) {
      modelHandle = model
      onNeighborhoodsDrop(model)
    }

    if (block.id === neighborhoodsGraphsBlockName) {
      modelHandle = model
      onNeighborhoodsGraphsDrop(model)
    }
  })

  return {
    selectHandler
  }
}
