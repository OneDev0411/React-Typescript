import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Frame from '../../../../../views/components/Deals/EmbedFormEdit'
import IconDocument from '../../../../../views/components/SvgIcons/Document/IconDocument'

export default ({
  task,
  incompleteFields,
  buttonCaption,
  loaded,
  saving,
  onSave,
  onClose,
  handleOpenPreview,
  onFrameRef,
  onReceiveMessage
}) => (
  <div className="deal-edit-form">
    <Row className="header">
      <Col md={6} sm={6} xs={6}>
        <span className="name">{task.title}</span>
      </Col>

      <Col md={6} sm={6} xs={6} className="actions">
        {loaded && (
          <button className="deal-button preview" onClick={handleOpenPreview}>
            <IconDocument />
            <span>Preview PDF</span>
          </button>
        )}

        {saving || !loaded ? (
          <span style={{ marginRight: '20px' }}>
            <i className="fa fa-spin fa-spinner" />&nbsp;
            {buttonCaption}
          </span>
        ) : (
          <button className="deal-button save" onClick={onSave}>
            {incompleteFields.length === 0 ? 'Save' : 'Save Draft'}
          </button>
        )}

        <button className="deal-button exit" onClick={onClose}>
          X
        </button>
      </Col>
    </Row>

    <Row>
      <Col md={12} sm={12} xs={12} style={{ overflow: 'none' }}>
        <Frame
          formId={task.form}
          frameRef={onFrameRef}
          onReceiveMessage={onReceiveMessage}
        />
      </Col>
    </Row>
  </div>
)
