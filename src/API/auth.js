import axios from "axios";

const server_base_url = process.env.VUE_APP_SERVER_BASE_URL

export const getAuthConfirm = async (authCode) => {
  
  try {
    const result = await axios.post(`${server_base_url}api/auth/callBack`, {code: authCode})
    
    return result
  } catch (error) {
    console.error(error)
  } 
}