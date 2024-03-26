import axios from "axios";

const baseUrl = `http://220.117.11.123:3000/`

export const getAccntIds = async (membersName) => {
  try {
    const result = await axios.post(`${baseUrl}accntids`, membersName)
    return result.data
  } catch (error) {
    console.error(error)
  } 
}


export const getMatchesData = async (matchesInfo) => {
  try {
    console.log("뭐야 이거 왜 안찍힘?", matchesInfo)
    const res = await axios.post(`${baseUrl}match`, matchesInfo)
    return res.data
  } catch (error) {
    console.error(error)
  }
}