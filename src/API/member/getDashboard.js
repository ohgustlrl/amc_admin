import axios from "axios";

const server_base_url = process.env.VUE_APP_SERVER_BASE_URL

export const getDashboardApi = async () => {
  
  try {
    const result = await axios.get(`${server_base_url}api/user/getDashboard`);
    
    return result.data
  } catch (error) {
    console.error("대시보드 데이터를 가져오는데 실패하였습니다.", error)
  } 
}