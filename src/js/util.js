/* eslint-disable no-unused-vars */

async function getOption(name) {
	const data = await chrome.storage.sync.get(name)
	return data[name]
}

async function loadOptions() {
	const [disableTranslateCode, customTabSize, tabSize] = await Promise.all([
		getOption('disable-translate-code'),
		getOption('custom-tab-size'),
		getOption('tab-size'),
	])
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
