const electron = require('electron')
let win = null;

const FRONTEND = "./frontend"
const BACKEND  = "./backend"

const app = electron.app;

function createWindow () {
	// get display options
	const mainScreen = electron.screen.getPrimaryDisplay().size;
	
	const screenWidth = mainScreen.width;
	const screenHeight = mainScreen.height;

	const windowWidth = 300 * 3;
	const windowHeight = 150 * 3;

	const padding = 10;


	// Create the browser window.
	win = new electron.BrowserWindow({
		width: windowWidth,
		height: windowHeight,
		transparent: true,
		webPreferences: {
			nodeIntegration: true
		},
		frame: false	// removes minimize and close buttons
	})

	// make window always on top
	win.setAlwaysOnTop(true, 'screen');

	// make window not resizable
	win.setResizable(false);

	// set window position
	win.setPosition(
						// padding,
						screenWidth - windowWidth - padding, 
						screenHeight - windowHeight - padding - 45);
						// padding);

	// hide menu buttons
	win.removeMenu();

	// set window opacity
	// win.setOpacity(0);

	// and load the index.html of the app.
	win.loadFile(`${FRONTEND}/index.html`)

	// Open the DevTools.
	win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(_ => {
	createWindow()
	require("./backend/controls.js")(win);
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
