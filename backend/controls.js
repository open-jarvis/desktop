const ipc = require("electron").ipcMain;
const app = require("electron").app;

function ipcControlsInit(win, wInfo) {
	ipc.on("controls", function(event, args) {
		if (typeof args.action !== "undefined") {
			console.log("controls:", args);
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
					win.setPosition(
						wInfo.screenWidth  - wInfo.windowWidth  - wInfo.padding, 
						wInfo.screenHeight - wInfo.windowHeight*2 - wInfo.padding - 45);
					win.setSize(wInfo.windowWidth, wInfo.windowHeight*2, true);
					break;
				case "normal-window":
					win.setPosition(
						wInfo.screenWidth  - wInfo.windowWidth  - wInfo.padding, 
						wInfo.screenHeight - wInfo.windowHeight - wInfo.padding - 45);
					win.setSize(wInfo.windowWidth, wInfo.windowHeight, true);
					break;
				default:
					break;
			}
		}
	})
}

module.exports = function(win, windowInfo) {
	ipcControlsInit(win, windowInfo);
}