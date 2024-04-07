import axios from "axios";

const baseUrl = `http://220.117.11.123:3000/`

export const getAuthConfirm = async (userUID) => {
  console.log(userUID)
  try {
    const result = await axios.post(`${baseUrl}login`, {userUID : userUID})
    return result.code
  } catch (error) {
    console.error(error)
  } 
}