const RESET_GUIDE_SOURCES = new Set(['home-reset-guide', 'lander']);

/** Homepage (and default lander) should get Kit’s Reset guide. Other lead sources stay quiet. */
function wantsResetGuide(source) {
  return RESET_GUIDE_SOURCES.has(source || 'lander');
}

module.exports = { wantsResetGuide, RESET_GUIDE_SOURCES };
