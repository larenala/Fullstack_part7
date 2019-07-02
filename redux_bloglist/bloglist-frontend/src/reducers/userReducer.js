const userReducer = (state=null, action) => {
  switch(action.type) {
    case 'SET_USER': 
      const newState = action.data
      return newState
    default: 
      return state
  }
}

export default userReducer