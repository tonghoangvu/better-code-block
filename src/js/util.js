/* eslint-disable no-unused-vars */

async function getOption(name) {
	const data = await chrome.storage.sync.get(name)
	return data[name]
}

async function loadOptions() {
	// Run in parallel and wait all to finish (can use Promise.all())
	const disableTranslateCodePromise = getOption('disable-translate-code')
	const customTabSizePromise = getOption('custom-tab-size')
	const tabSizePromise = getOption('tab-size')
	return {
		'disable-translate-code': await disableTranslateCodePromise,
		'custom-tab-size': await customTabSizePromise,
		'tab-size': await tabSizePromise,
	}
}

async function saveOptions(options) {
	await chrome.storage.sync.set(options)
}

function buildMessage(code, data) {
	return { code, data }
}

async function sendMessageToAllTabs(message) {
	const tabs = await chrome.tabs.query({})
	for (const tab of tabs) chrome.tabs.sendMessage(tab.id, message) // Don't need to wait
}
