const ipc = require("electron").ipcMain;
const app = require("electron").app;

function ipcControlsInit(win) {
	ipc.on("controls", function(event, args) {
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
				default:
					break;
			}
		}
	})
}

module.exports = function(win) {
	ipcControlsInit(win);
}