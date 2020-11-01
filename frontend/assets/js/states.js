class StatusDot {
	static get GREEN() {
		StatusDot.OFF;
		document.querySelector("#status-dot").classList.add("green");
	}
	static get ORANGE() {
		StatusDot.OFF;
		document.querySelector("#status-dot").classList.add("orange");
	}
	static get RED() {
		StatusDot.OFF;
		document.querySelector("#status-dot").classList.add("red");
	}
	static get BLUE() {
		StatusDot.OFF;
		document.querySelector("#status-dot").classList.add("blue");
	}
	static get OFF() {
		document.querySelector("#status-dot").classList.remove("red");
		document.querySelector("#status-dot").classList.remove("green");
		document.querySelector("#status-dot").classList.remove("blue");
		document.querySelector("#status-dot").classList.remove("orange");
	}
}

class Siri {
	static get OFF() {
		siriWave.setAmplitude(0);
		siriWave.setSpeed(0);	
	}
	static get SILENT() {
		siriWave.setAmplitude(	0.15		);
		siriWave.setSpeed(		0.15 / 4	);	
	}
	static get NOISE() {
		siriWave.setAmplitude(	0.5			);
		siriWave.setSpeed(		0.5 / 4		);
	}
	static get SPEAKING() {
		siriWave.setAmplitude(	1			);
		siriWave.setSpeed(		1 / 4		);
	}
}