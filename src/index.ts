import { defineWebApplication } from '@ownclouders/web-pkg'
import App from './App.vue'

const appId = '3dmodel-viewer'

export default defineWebApplication({
  setup() {
    const routes = [
      {
        name: appId,
        path: '/:driveAliasAndItem(.*)?',
        component: App,
        meta: {
          authContext: 'hybrid',
          patchCleanPath: true
        }
      }
    ]

    return {
      appInfo: {
        name: '3D Model Viewer',
        id: appId,
        icon: 'resource-type-graphic',
        iconFillType: 'fill',
        iconColor: '#86C540',
        extensions: [
          {
            extension: 'glb',
            label: 'View 3D Model'
          },
          {
            extension: 'stl',
            label: 'View STL 3D Model'
          },
        ]
      },
      routes
    }
  }
})
