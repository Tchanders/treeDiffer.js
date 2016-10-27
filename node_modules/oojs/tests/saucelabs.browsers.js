/*jshint node:true */

/**
 * Cover a wide range of browsers with (ideally) no more than 6 browsers (2 batches of 3).
 *
 * More info: https://saucelabs.com/platforms
 */
module.exports = {
	// Latest Chrome
	slChrome: {
		base: 'SauceLabs',
		browserName: 'chrome'
	},
	// Latest Firefox
	slFirefox: {
		base: 'SauceLabs',
		browserName: 'firefox'
	},
	// Oldest Safari that Sauce Labs provides
	slSafari6: {
		base: 'SauceLabs',
		browserName: 'safari',
		version: '6'
	},
	// Latest IE
	slIE11: {
		base: 'SauceLabs',
		platform: 'Windows 7',
		browserName: 'internet explorer',
		version: '11'
	},
	// Latest IE before full ES5 support
	slIE9: {
		base: 'SauceLabs',
		platform: 'Windows 7',
		browserName: 'internet explorer',
		version: '9'
	},
	// Oldest IE we support
	slIE6: {
		base: 'SauceLabs',
		platform: 'Windows XP',
		browserName: 'internet explorer',
		version: '6'
	}
};
