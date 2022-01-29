chrome.runtime.onInstalled.addListener(() => {
	// Set initial options
	chrome.storage.sync.set({
		'disable-translate-code': true,
		'custom-tab-size': true,
		'tab-size': 4,
	})
})
