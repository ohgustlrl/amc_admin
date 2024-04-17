import axios from "axios";

const baseUrl = `https://khsserver.pe.kr/`

export const getAccntIds = async (membersName) => {
  try {
    const result = await axios.post(`${baseUrl}accntids`, membersName)
    return result.data
  } catch (error) {
    console.error(error)
  } 
}


export const getMatchesData = async (matchesInfo, progressCallback) => {
  let progress = null
  try {
    const res = await axios.post(`${baseUrl}match`, matchesInfo, {
      onDownloadProgress: progressEvent => {
        let loadedBytes = progressEvent.loaded
        const totalBytes = progressEvent.total

        progress = Math.round((loadedBytes / totalBytes) * 100)
        Number(progress)

        progressCallback(progress)
      }
  })
    return res.data
  } catch (error) {
    console.error(error)
  }
}