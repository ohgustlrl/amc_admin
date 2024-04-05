import axios from "axios";

const baseUrl = `http://220.117.11.123:3000/`

export const getDiscordMemberListAPI = async () => {
  try {
    const result = await axios.get(`${baseUrl}dc_members`)
    return result.data
  } catch (error) {
    console.error(error)
  } 
}