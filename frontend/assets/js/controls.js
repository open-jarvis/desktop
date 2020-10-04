const ipcRenderer = require('electron').ipcRenderer;

document.getElementById("close").addEventListener("click", e => {
	document.getElementById("main-container").classList.remove("visible");

	setTimeout(function() {
		ipcRenderer.send("controls", { action: "exit" });
	}, 300);
	
});
document.getElementById("minimize").addEventListener("click", e => {
	document.getElementById("main-container").classList.remove("visible");
	
	setTimeout(function() {
		ipcRenderer.send("controls", { action: "minimize" });
		setTimeout(function() {
			document.getElementById("main-container").classList.add("visible");
		}, 100);
	}, 300);
});
document.getElementById("settings").addEventListener("click", e => {
	ipcRenderer.send("controls", { action: "debugger" });
});

setTimeout(function() {
	document.getElementById("main-container").classList.add("visible");
}, 50);