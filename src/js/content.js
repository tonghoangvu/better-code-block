load()
chrome.runtime.onMessage.addListener((message) => {
	if (message.code == 'RELOAD') load()
})

async function load() {
	const options = await loadOptions()
	applyDisableTranslateCode(options[OptionKey.DISABLE_TRANSLATE_CODE])
	applyTabSize(
		options[OptionKey.CUSTOM_TAB_SIZE],
		options[OptionKey.TAB_SIZE],
	)
}

function applyDisableTranslateCode(isDisabled) {
	const NO_TRANSLATE_CLASS = 'notranslate'
	const elements = document.querySelectorAll(
		'pre, code, textarea, .codeblock, .syntaxhighlighter',
	)
	for (const element of elements)
		if (isDisabled === true) element.classList.add(NO_TRANSLATE_CLASS)
		else element.classList.remove(NO_TRANSLATE_CLASS)
}

function applyTabSize(customTabSize, tabSize) {
	const TAB_SIZE_CSS_PROPERTY = 'tab-size'
	const elements = document.querySelectorAll('pre, code, textarea')
	for (const element of elements)
		if (customTabSize === true)
			element.style.setProperty(TAB_SIZE_CSS_PROPERTY, tabSize)
		else element.style.removeProperty(TAB_SIZE_CSS_PROPERTY)
}
