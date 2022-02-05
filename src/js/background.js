importScripts('./util.js')

chrome.runtime.onInstalled.addListener(() => {
	// Set initial options
	chrome.storage.sync.set({
		[OptionKey.DISABLE_TRANSLATE_CODE]: true,
		[OptionKey.CUSTOM_TAB_SIZE]: true,
		[OptionKey.TAB_SIZE]: 4,
	})
})
