import axios from "axios";

const baseUrl = `http://220.117.11.123:3000/`

export const getAuthConfirm = async (userUID) => {
  console.log(userUID)
  try {
    const result = await axios.post(`${baseUrl}login`, {userUID : userUID})
    console.log("auth.js에서 반환하는 값은?", result)
    return result.data.code
  } catch (error) {
    console.error(error)
  } 
}