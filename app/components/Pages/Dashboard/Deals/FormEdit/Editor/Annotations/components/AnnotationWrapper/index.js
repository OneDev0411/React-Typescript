import { useSelector } from 'react-redux'

import { searchContext } from '@app/models/Deal/helpers/brand-context/search-context'
import { getBrandChecklistsById } from '@app/reducers/deals/brand-checklists'
import { isValidDate } from '@app/utils/date-times'
import { calculateWordWrap } from 'deals/FormEdit/utils/word-wrap'

import { formatDate } from '../../../../utils/format-date'

export function AnnotationWrapper(props) {
  const brandChecklists = useSelector(({ deals }) =>
    getBrandChecklistsById(deals.brandChecklists, props.deal.brand.id)
  )

  return (
    <>
      {Object.entries(props.items).map(([, groups]) =>
        Object.entries(groups).map(([, group]) => {
          const annotation = group[0]

          const annotations = group
            .sort((a, b) => a.order - b.order)
            .map(item => item.annotation)

          const context = annotation.context
            ? searchContext(props.deal, brandChecklists, annotation.context)
            : null

          const { appearance, rects, values, fontSize } = calculateWordWrap(
            annotations,
            getFormValue(props.values, annotations, context, annotation.format)
          )

          return rects.map((rect, index) => {
            const key = `${annotation.annotation.fieldName}-${index}`

            const style = {
              position: 'absolute',
              left: `${rect.left}px`,
              top: `${rect.top}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              fontSize: `${fontSize || 16}px`,
              fontFamily: appearance.font,
              color: appearance.color,
              fontWeight: appearance.bold ? 'bold' : 'normal',
              minWidth: '15px',
              padding: '0 3px',
              cursor: 'pointer'
            }

            if (annotation.readonly) {
              return (
                <div
                  key={key}
                  style={{
                    ...style,
                    cursor: 'default',
                    padding: 0,
                    backgroundColor: 'transparent',
                    border: 'none',
                    whiteSpace: 'pre'
                  }}
                >
                  {values[index]}
                </div>
              )
            }

            return props.render({
              key,
              style,
              rect,
              values,
              group,
              appearance: {
                ...appearance,
                fontSize
              },
              annotation,
              rectIndex: index,
              value: values[index] || ''
            })
          })
        })
      )}
    </>
  )
}

function getFormValue(values, annotations, context, format) {
  const valueList = annotations
    .map(annotation => {
      const value = values[annotation.fieldName]

      if (context?.data_type === 'Date' && !!format && !!value) {
        return isValidDate(new Date(value)) ? formatDate(value, format) : value
      }

      return value
    })
    .filter(Boolean)

  return valueList.length > 0 ? valueList.join(' ') : undefined
}
