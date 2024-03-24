import axios from "axios";

const baseUrl = `http://220.117.11.123:3000/`

export const getMatchesData = async (matchesInfo) => {
  const objectToJson = JSON.stringify(matchesInfo)
  axios.post(`${baseUrl}match`, {
    // data
    ...objectToJson
  }, {
    headers : {
      'Content-Type' : 'application/json'
    }
  })
}