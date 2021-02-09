const ipc = require("electron").ipcMain;
const app = require("electron").app;

let x, y, w, h;

const          WINDOW_WIDTH = 300;
const     MAX_WINDOW_HEIGHT = 320;
const     MIN_WINDOW_HEIGHT = 35;
const DEFAULT_WINDOW_HEIGHT = 160;

function ipcControlsInit(win, wInfo) {
	ipc.on("controls", function(event, args) {
		console.log("backend:", args);
		if (typeof args.action !== "undefined") {
			switch (args.action) {
				case "exit":
					win.close();
					app.exit(0);
					break;
				case "minimize":
					win.minimize();
					break;
				case "maximize":
					win.maximize();
					break;
				case "debugger":
					win.webContents.openDevTools({ mode: "undocked" });
					break;
				/*
				 * NOT WORKING YET:
				 */
				case "expanded-window":
					changeWindowHeight(win,wInfo,MAX_WINDOW_HEIGHT);
					break;
				case "normal-window":
					changeWindowHeight(win,wInfo,DEFAULT_WINDOW_HEIGHT);
					break;
				case "minimal-window":
					changeWindowHeight(win,wInfo,MIN_WINDOW_HEIGHT);
				default:
					break;
			}
		}
	})
}

function changeWindowHeight(win,wInfo,h) {
	w = WINDOW_WIDTH;
	x = wInfo.screenWidth  - w - wInfo.padding;
	y = wInfo.screenHeight - h - wInfo.padding - 45;

	win.setResizable(true);

	win.setPosition(x, y);
	win.setSize(w, h);
	win.setResizable(false);
}

module.exports = function(win, windowInfo) {
	ipcControlsInit(win, windowInfo);
}