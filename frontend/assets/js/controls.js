const ipcRenderer = require('electron').ipcRenderer;

let stage = 1;
let stages = [
	"minimal-window",
	"normal-window",
	"expanded-window"
]

document.getElementById("close").addEventListener("click", e => {
	document.getElementById("main-container").classList.remove("visible");

	setTimeout(function() {
		ipcRenderer.send("controls", { action: "exit" });
	}, 300);
});

document.getElementById("minimize").addEventListener("click", e => {
	if (stage == 0) {
		ipcRenderer.send("controls", { action: "debugger" });
		return;
	}
	stage --;

	ipcRenderer.send("controls", { action: stages[stage] });
});

document.getElementById("maximize").addEventListener("click", e => {
	if (stage == 2) {
		return;
	}
	stage ++;

	ipcRenderer.send("controls", { action: stages[stage] });
});


let oldStage = 1;
let minimizeWindow = () => {setState(0)};
let normalizeWindow = () => {setState(1)};
let maximizeWindow = () => {setState(2)};
function loadOldStage() {
	stage = oldStage;
	ipcRenderer.send("controls", { action: stages[stage] });
}
function setState(stg) {
	if (stg < 0 || stg > 2) { return; }
	oldStage = stage;
	stage = stg;
	ipcRenderer.send("controls", { action: stages[stage] });
}


setTimeout(function() {
	document.getElementById("main-container").classList.add("visible");
}, 50);