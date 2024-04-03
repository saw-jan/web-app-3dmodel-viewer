import axios from 'axios'
import { xml2js } from 'xml-js'
import { _ } from 'lodash'
import config from '../config'

const sendRequest = ({ method, path }): Promise<any> => {
  const headers = {
    Authorization: `Basic ${Buffer.from(`${config.adminUser}:${config.adminPassword}`).toString('base64')}`
  }
  return axios({
    method,
    url: path.join(config.baseUrlOcis, path),
    headers
  })
}

export const deleteAllFiles = async (): Promise<void> => {
  // check path, it doesn't seem like this is deleting all files
  const response = await sendRequest({ method: 'PROPFIND', path: 'remote.php/dav/files/admin' })
  const xmlResponse = response.data
  const result = xml2js(xmlResponse, { compact: true })
  const resp = _.get(result, 'd:multistatus.d:response')
  const href = _.get(resp[1], 'd:href._text')

  return await sendRequest({ method: 'DELETE', path: href })
}

export const emptyTrashbin = async (): Promise<void> => {
  return await sendRequest({ method: 'DELETE', path: 'remote.php/dav/trash-bin/admin' })
}
