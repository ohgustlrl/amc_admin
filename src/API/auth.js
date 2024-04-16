import axios from "axios";

const baseUrl = `khsserver.pe.kr/`

export const getAuthConfirm = async (userUID) => {
  try {
    const result = await axios.post(`${baseUrl}login`, {userUID : userUID})
    return result.data.code
  } catch (error) {
    console.error(error)
  } 
}