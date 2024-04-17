import axios from "axios";

const baseUrl = `https://khsserver.pe.kr/`

export const getDiscordMemberListAPI = async () => {
  try {
    const result = await axios.get(`${baseUrl}dc_members`)
    return result.data
  } catch (error) {
    console.error(error)
  } 
}