import axios from "axios";

const baseUrl = `https://khsserver.pe.kr:3000/`

export const getDiscordMemberListAPI = async () => {
  try {
    const result = await axios.get(`${baseUrl}dc_members`)
    return result.data
  } catch (error) {
    console.error(error)
  } 
}