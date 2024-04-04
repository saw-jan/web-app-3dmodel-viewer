import axios from 'axios'
import { xml2js } from 'xml-js'
import { _ } from 'lodash'
import config from '../config'
import _path from 'path'

const sendRequest = ({ method, path }): Promise<any> => {
  const headers = {
    Authorization: `Basic ${Buffer.from(`${config.adminUser}:${config.adminPassword}`).toString('base64')}`
  }
  return axios({
    method,
    url: _path.join(config.baseUrlOcis, path),
    headers
  })
}

const deleteFile = async (resource): Promise<void> => {
  const href = _.get(resource, 'd:href._text')
  return await sendRequest({ method: 'DELETE', path: href })
}

export const deleteAllFiles = async (): Promise<void> => {
  const response = await sendRequest({ method: 'PROPFIND', path: 'remote.php/dav/files/admin' })
  const xmlResponse = response.data
  const result = xml2js(xmlResponse, { compact: true })
  const resp = _.get(result, 'd:multistatus.d:response')
  for (const r in resp) {
    await deleteFile(r)
  }
}

export const emptyTrashbin = async (): Promise<void> => {
  return await sendRequest({ method: 'DELETE', path: 'remote.php/dav/trash-bin/admin' })
}
