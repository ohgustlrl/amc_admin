import axios from "axios";

const server_base_url = process.env.VUE_APP_SERVER_BASE_URL

export const getAuthConfirm = async (authCode, currentRedirectUri) => {
  
  try {
    const result = await axios.post(`${server_base_url}api/callback`, {
      code: authCode,
      redirectUri: currentRedirectUri
    })
    
    return result
  } catch (error) {
    console.error(error)
  } 
}