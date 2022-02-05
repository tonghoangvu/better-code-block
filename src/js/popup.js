const disableTranslateCodeInput = document.getElementById(
	'disable-translate-code'
)
const customTabSizeInput = document.getElementById('custom-tab-size')
const tabSizeInput = document.getElementById('tab-size')
const messageElement = document.getElementById('message')
const saveButton = document.getElementById('save')
const discardButton = document.getElementById('discard')

load()
assignEventsForInputs()
assignEventsForButtons()

async function load() {
	const options = await loadOptions()
	applyOptionsToUi(options)
	updateTabSizeInputStatus()
}

function applyOptionsToUi(options) {
	disableTranslateCodeInput.checked =
		options[OptionKey.DISABLE_TRANSLATE_CODE]
	customTabSizeInput.checked = options[OptionKey.CUSTOM_TAB_SIZE]
	tabSizeInput.value = options[OptionKey.TAB_SIZE]
}

function updateTabSizeInputStatus() {
	tabSizeInput.disabled = !customTabSizeInput.checked
}

function assignEventsForInputs() {
	disableTranslateCodeInput.addEventListener('change', () =>
		doAlert('UNSAVED')
	)
	customTabSizeInput.addEventListener('change', () => {
		updateTabSizeInputStatus()
		doAlert('UNSAVED')
	})
	tabSizeInput.addEventListener('change', () => doAlert('UNSAVED'))
}

function doAlert(message) {
	switch (message) {
		case 'UNSAVED':
			showMessage('gray', 'Unsaved changes')
			break
		case 'SAVED':
			showMessage('green', 'Changes saved')
			break
		case 'RESTORED':
			showMessage('green', 'Previous options restored')
			break
	}
}

function showMessage(color, message) {
	messageElement.textContent = message
	messageElement.style.setProperty('color', color)
	messageElement.hidden = false
}

function assignEventsForButtons() {
	saveButton.addEventListener('click', async () => {
		const error = validateUi()
		if ((error ?? null) !== null) {
			showMessage('red', error)
			return
		}
		const options = collectOptionsFromUi()
		await saveOptions(options)
		await applyOptionsToAllTabs()
		doAlert('SAVED')
	})
	discardButton.addEventListener('click', async () => {
		await load()
		doAlert('RESTORED')
	})
}

function validateUi() {
	const minTabSize = Number(tabSizeInput.min)
	const maxTabSize = Number(tabSizeInput.max)
	const tabSize = Number(tabSizeInput.value)
	if (isNaN(minTabSize) || isNaN(maxTabSize) || isNaN(tabSize)) return null
	if (tabSize < minTabSize || tabSize > maxTabSize)
		return `Tab size must be between ${minTabSize} and ${maxTabSize}`
	return null
}

function collectOptionsFromUi() {
	return {
		[OptionKey.DISABLE_TRANSLATE_CODE]: disableTranslateCodeInput.checked,
		[OptionKey.CUSTOM_TAB_SIZE]: customTabSizeInput.checked,
		[OptionKey.TAB_SIZE]: tabSizeInput.value,
	}
}

async function applyOptionsToAllTabs() {
	await sendMessageToAllTabs(buildMessage('RELOAD'))
}
