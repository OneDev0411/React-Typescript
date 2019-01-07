import styled from 'styled-components'

export const Container = styled.div`
  .messages {
    height: auto !important;
    margin: 0 0 2rem 0 !important;

    .loading {
      width: 90%;
    }

    .messages-list {
      margin-top: 10px !important;
      margin-bottom: 2rem !important;
      min-height: auto !important;
      max-height: none !important;
      width: 100%;
    }

    .delivery-report {
      display: none;
    }

    .messages-list .message-group .comment,
    .messages-list .message-group .attachment {
      display: block;
      position: relative;
      width: 100%;
      border-radius: 3px;
      background-color: #fcfcfc;
      border: 1px solid #ccc;
      padding: 0.5rem 0.5rem 0.5rem 2.6rem;
      margin-top: 1rem !important;

      :after,
      :before {
        bottom: 100%;
        left: 3%;
        border: solid transparent;
        content: ' ';
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
      }

      :after {
        border-color: rgba(255, 255, 255, 0);
        border-bottom-color: #fff;
        border-width: 8px;
        margin-left: -8px;
      }

      :before {
        border-color: rgba(204, 204, 204, 0);
        border-bottom-color: #ccc;
        border-width: 9px;
        margin-left: -9px;
      }
    }

    .messages-list .message-subitem {
      border-radius: 3px;
      background-color: #fcfcfc;
      border: 1px solid #cccccc;
      padding: 0 0.5rem 0 2.6rem;

      .date {
        width: auto;
      }
    }

    .messages-list .message-info {
      background-color: transparent !important;
    }

    .messages-list .activity {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      color: #808080;
      font-size: 0.875rem;
      margin: 0.5rem 0;

      .name {
        font-weight: 400;
        max-width: 20rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
`
