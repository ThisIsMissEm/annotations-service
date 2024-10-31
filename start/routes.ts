/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AnnotationsController = () => import('#controllers/annotations_controller')
const AnnotationController = () => import('#controllers/annotation_controller')

router
  .group(() => {
    router.resource('annotations', AnnotationsController).only(['index', 'create', 'show'])
    router
      .resource('annotations.annotation', AnnotationController)
      .params({ annotations: 'collectionId' })
      .only(['show', 'edit', 'update', 'destroy'])
      .as('annotation')
  })
  .use(middleware.auth())
