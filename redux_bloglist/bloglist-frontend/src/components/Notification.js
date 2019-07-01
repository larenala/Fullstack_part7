import React from 'react'
import { connect } from 'react-redux'

const Notification = ( props ) => {
  console.log('props ', props)
  const display = {
    display: props.notification === '' ? 'none' : 'block'
  }
  return (
    <div display={display}>
      <div className={props.style}>
      {props.notification}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification,
    style: state.style
  }
}

const ConnectedNotification = connect(mapStateToProps)(Notification)
export default ConnectedNotification