siriwave = {
	"amplitude": {
		"SPEAKING": 1,
		"NOISE": 0.5,
		"SILENT": 0.15
	},

	"speed": {
		"SPEAKING": 0.25,
		"NOISE": 0.5 / 4,
		"SILENT": 0.15 / 4
	}
}


function siriSilent() {
	siriWave.setAmplitude(siriwave.amplitude.SILENT);
	siriWave.setSpeed(siriwave.speed.SILENT);
}
function siriSpeaking() {
	siriWave.setAmplitude(siriwave.amplitude.SPEAKING);
	siriWave.setSpeed(siriwave.speed.SPEAKING);
}
function siriNoise() {
	siriWave.setAmplitude(siriwave.amplitude.NOISE);
	siriWave.setSpeed(siriwave.speed.NOISE);
}


var siriWave = new SiriWave({
	container: document.getElementById("siriwave"),
	width: document.querySelector("body").getBoundingClientRect().width,
	height: 150,
	style: "ios9"
});

siriSilent();