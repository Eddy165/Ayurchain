import axios from 'axios'
import { useAppDispatch } from '../store/hooks'
import { setUploadProgress } from '../store/uiSlice'

const PINATA_API = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
const GATEWAY = import.meta.env.VITE_PINATA_GATEWAY

export function useIPFS() {
  const dispatch = useAppDispatch()

  const upload = async (
    file: File,
    metadata: Record<string, string>
  ): Promise<{ cid: string; url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('pinataMetadata', JSON.stringify({
      name: `ayurchain-${metadata.batchId ?? 'doc'}-${Date.now()}`,
      keyvalues: metadata,
    }))
    formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }))

    const response = await axios.post(PINATA_API, formData, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      },
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / (e.total ?? 1))
        dispatch(setUploadProgress(percent))
      },
    })

    const cid = response.data.IpfsHash
    const url = `${GATEWAY}${cid}`
    dispatch(setUploadProgress(0))
    return { cid, url }
  }

  const uploadMultiple = async (
    files: File[],
    metadata: Record<string, string>
  ): Promise<Array<{ cid: string; url: string }>> => {
    return Promise.all(files.map(f => upload(f, metadata)))
  }

  const getUrl = (cid: string) => `${GATEWAY}${cid}`

  return { upload, uploadMultiple, getUrl }
}
