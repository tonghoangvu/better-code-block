/* eslint-disable no-unused-vars */

async function getOption(name) {
	const data = await chrome.storage.sync.get(name)
	return data[name]
}

async function loadOptions() {
	// Should use Promise.all() when possible
	const disableTranslateCode = await getOption('disable-translate-code')
	const customTabSize = await getOption('custom-tab-size')
	const tabSize = await getOption('tab-size')
	return {
		'disable-translate-code': disableTranslateCode,
		'custom-tab-size': customTabSize,
		'tab-size': tabSize,
	}
}

async function saveOptions(options) {
	await chrome.storage.sync.set(options)
}

function buildMessage(code, data) {
	return { code, data }
}

async function sendMessageToAllTabs(message) {
	await chrome.tabs.query({}, tabs => {
		for (const tab of tabs) chrome.tabs.sendMessage(tab.id, message)
	})
}
