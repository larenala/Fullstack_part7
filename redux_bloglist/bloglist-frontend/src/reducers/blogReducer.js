const blogReducer = (state= [], action) => {
    switch(action.type) {
        case 'GET_BLOGS':
            const newState = action.data
            return newState 
        default:
            return state
    }
}

export default blogReducer