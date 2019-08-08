import axios from 'axios'
const baseUrl = '/api/users'

const getAll = () => {
  try {
    const request = axios.get(baseUrl)
    const res = request.then(response => response.data)
    return res
  } catch (exception) {
    console.log('exception ', exception)
  }
}

export default { getAll }