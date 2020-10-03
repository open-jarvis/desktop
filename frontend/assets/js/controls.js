const { exists } = require("fs");

const ipc = require("electron").ipcRenderer;

document.getElementById("close").addEventListener("click", e => {
	ipc.send("controls", { action: "exit" });
});
document.getElementById("minimize").addEventListener("click", e => {
	ipc.send("controls", { action: "minimize" });
	setTimeout(function() {
		ipc.send("controls", { action: "maximize" });
	}, 1000);
});