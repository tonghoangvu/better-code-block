/* eslint-disable no-unused-vars */

// Don't use the name Option
const OptionKey = {
	DISABLE_TRANSLATE_CODE: 'disable-translate-code',
	CUSTOM_TAB_SIZE: 'custom-tab-size',
	TAB_SIZE: 'tab-size',
}

async function getOption(name) {
	const data = await chrome.storage.sync.get(name)
	return data[name]
}

async function loadOptions() {
	// Run in parallel and wait all to finish (can use Promise.all())
	const disableTranslateCodePromise = getOption(
		OptionKey.DISABLE_TRANSLATE_CODE,
	)
	const customTabSizePromise = getOption(OptionKey.CUSTOM_TAB_SIZE)
	const tabSizePromise = getOption(OptionKey.TAB_SIZE)
	return {
		[OptionKey.DISABLE_TRANSLATE_CODE]: await disableTranslateCodePromise,
		[OptionKey.CUSTOM_TAB_SIZE]: await customTabSizePromise,
		[OptionKey.TAB_SIZE]: await tabSizePromise,
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
