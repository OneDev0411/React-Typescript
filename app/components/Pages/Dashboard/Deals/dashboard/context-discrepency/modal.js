import React from 'react'
import moment from 'moment'
import Modal from '../../../../../../views/components/BasicModal'
import Deal from '../../../../../../models/Deal'
import DealContext from '../../../../../../models/DealContext'
import ContextHistory from '../../../../../../models/Deal/context-history-helper'

function getContextLabel(name) {
  const context = DealContext.getList().find(ctx => ctx.name === name)

  return context.label
}

export default ({ isOpen, field, history, handleOnClose }) => {
  if (!isOpen) {
    return false
  }

  return (
    <Modal
      isOpen
      shouldCloseOnOverlayClick={false}
      handleOnClose={handleOnClose}
      className="deal-factsheet-context-history"
    >
      <Modal.Header
        title={`${getContextLabel(field.name)} History`}
        showClose
        handleOnClose={handleOnClose}
      />

      <Modal.Body className="modal-body" noFooter>
        {history &&
          history.map(ctx => {
            const context = {
              value: Deal.get.field(null, null, ctx)
            }

            return (
              <div className="context-row" key={ctx.id}>
                <div className="item">
                  <div>Creation Time:</div>
                  <div>
                    {moment
                      .unix(ctx.created_at)
                      .format('MMMM DD, YY [at] hh:mm A')}
                  </div>
                </div>

                <div className="item">
                  <div>On Rechat:</div>
                  <div>{DealContext.getValueByContext(ctx.key, context)}</div>
                </div>

                <div className="item">
                  <div>Provided By:</div>
                  <div>{ContextHistory.getCreatorName(ctx)}</div>
                </div>

                <div className="item">
                  <div>Form:</div>
                  <div>{ContextHistory.getFormName(ctx)}</div>
                </div>

                <div className="item">
                  <div>Approved By:</div>
                  <div>{ContextHistory.getApproverName(ctx)}</div>
                </div>
              </div>
            )
          })}
      </Modal.Body>
    </Modal>
  )
}
