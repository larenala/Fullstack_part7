const notificationAtStart = {
  notification: null,
  style: null
}

export const createNotification = (props) => {
    return {
        type: 'CREATE',
          data: {
            notification: props.notification,
            style: props.style
          }      
      }
}

export const removeMessage = () => {
    return {
      type: 'REMOVE'
    }
}

const notificationReducer = (state = notificationAtStart, action) => {
    switch (action.type) {
        case 'CREATE':
          const newState = {
            notification: action.data.notification,
            style: action.data.style
          }
          return newState
        case 'REMOVE':
          const initialState = notificationAtStart
          return initialState
        default:
          return state
    }
}

export default notificationReducer