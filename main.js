const {app, BrowserWindow} = require('electron');
const process = require('process');

function createWindow() {
	const window = new BrowserWindow({
		width: 480,
		height: 360,
		useContentSize: true,
		autoHideMenuBar: true,
		title: 'You are an idiot!',
	});

	window.loadFile('index.html');
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
