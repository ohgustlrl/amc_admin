import axios from "axios";

const server_base_url = process.env.VUE_APP_SERVER_BASE_URL

export const getMemberListApi = async (params) => {
  let page, limit, search

  page = params.page
  limit = params.limit
  search = params.search

  try {
    const result = await axios.post(`${server_base_url}api/user/getMemberList`, {
      page,
      limit,
      search,
    });
    
    return result.data
  } catch (error) {
    console.error("대시보드 데이터를 가져오는데 실패하였습니다.", error)
  } 
}