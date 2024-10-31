import AnnotationCollection from '#models/annotation_collection'
import type { HttpContext } from '@adonisjs/core/http'

export default class AnnotationsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    AnnotationCollection.find(params.id)
  }
}
