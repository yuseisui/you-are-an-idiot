const {app, BrowserWindow, screen} = require('electron');
const path = require('path');
const process = require('process');

const choice = (array) => array[Math.trunc(Math.random() * array.length)];

const createWindow = () => {
	const window = new BrowserWindow({
		width: 480,
		height: 360,
		useContentSize: true,
		autoHideMenuBar: true,
		title: 'You are an idiot!',
		alwaysOnTop: true,
		resizable: false,
		movable: false,
		minimizable: false,
		maximizable: false,
		fullscreenable: false,
	});

	window.loadFile(path.join(__dirname, '../renderer/index.html'));

	return window;
};

const main = () => {
	const window = createWindow();
	const interval = 16;
	const vectors = [-16, -8, 8, 16];
	let dx = choice(vectors);
	let dy = choice(vectors);

	const timerId = setInterval(() => {
		if (window.isDestroyed()) {
			clearInterval(timerId);
			return;
		}

		const {workAreaSize} = screen.getPrimaryDisplay();
		const [windowX, windowY] = window.getPosition();
		const [windowWidth, windowHeight] = window.getSize();

		const margin = {
			left: windowX,
			top: windowY,
			right: workAreaSize.width - windowX - windowWidth,
			bottom: workAreaSize.height - windowY - windowHeight,
		};

		if (margin.left + dx < 0 || margin.right - dx < 0) {
			dx = -dx;
		}

		if (margin.top + dy < 0 || margin.bottom - dy < 0) {
			dy = -dy;
		}

		window.setPosition(windowX + dx, windowY + dy);
	}, interval);

	window.on('close', (event) => {
		event.preventDefault();
		main();
	});
};

app.whenReady().then(() => {
	main();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			main();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
