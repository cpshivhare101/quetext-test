/** English stop words removed before token-overlap scoring. */
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'as',
  'by', 'with', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'it', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they',
  'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
]);

module.exports = { STOP_WORDS };
