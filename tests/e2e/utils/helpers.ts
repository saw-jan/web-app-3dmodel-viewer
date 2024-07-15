import axios from 'axios'
import config from '../config'
import _path from 'path'
import * as fs from 'fs'

const uploadedFiles: string[] = []

const getWebDavFilePath = (user, filename) => {
  return _path.join('remote.php/dav/files', user, filename)
}

const getWebDavTrashbinPath = (user) => {
  return _path.join('remote.php/dav/trash-bin', user)
}

const makeApiRequest = ({ method, path, data = null }): Promise<any> => {
  try {
    const headers = {
      Authorization: `Basic ${Buffer.from(`${config.adminUser}:${config.adminPassword}`).toString('base64')}`
    }
    return axios({
      method,
      url: _path.join(config.baseUrlOcis, path),
      headers,
      data
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const uploadFile = async (filename: string): Promise<any> => {
  const fileUploadUrl = getWebDavFilePath(config.adminUser, filename)
  const filePath = _path.join(config.assets, filename)
  const fileContent = fs.readFileSync(filePath)
  const response = await makeApiRequest({
    method: 'PUT',
    path: fileUploadUrl,
    data: fileContent
  })
  if (response.status !== 201) {
    throw new Error(`Failed to upload file ${filename}`)
  }
  uploadedFiles.push(filename)
  return response.status
}

const deleteFile = async (filename): Promise<any> => {
  const response = await makeApiRequest({
    method: 'DELETE',
    path: getWebDavFilePath(config.adminUser, filename)
  })
  //console.log('delete file response status code: ' + response.status) // 204
  return response.status
}

export const deleteAllFiles = async (): Promise<void> => {
  while (uploadedFiles.length > 0) {
    await deleteFile(uploadedFiles.pop())
  }
}

export const emptyTrashbin = async (): Promise<void> => {
  return await makeApiRequest({
    method: 'DELETE',
    path: getWebDavTrashbinPath(config.adminUser)
  })
}
