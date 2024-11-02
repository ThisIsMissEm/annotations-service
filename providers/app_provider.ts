export default class AppProvider {
  async boot() {
    await import('../extensions/http_context_prefers.js')
  }
}
