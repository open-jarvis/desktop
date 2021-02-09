function getInstantDecisionCalls() {
	Jarvis.instantDecisionScan(undefined, "call").then(d => {
		for (const token in d) {
			for (let i = 0; i < d[token].length; i++) {
				let data = d[token][i];
				console.log(data);
				
				if (!data.answered) {
					if (document.querySelector(".decision[data-id='" + token + data.type +"']")) {
						return;
					}

					hideNotifications();
					maximizeWindow();


					let code = `<div class="infos"><span class="head">${data.name || ""}</span><span class="description">${data.infos || ""}</span></div>`;
					code += `<div class="options-wrapper"><div class="options">`;

					data.options.forEach((o, i) => {
						code += `<div class="option" style="${o.color ? `background-color:${o.color};` : ""}${o.color ? `color:${pickTextColorBasedOnBgColorSimple(o.color)}` : ""}" onclick="answerInstantDecision('${token}', '${data.type}', ${i}, 'Desktop user answered call')">${o.material ? `<i>${o.material}</i>` : ""}${o.text ? o.text : ""}</div>`;
					});

					code += "</div></div>";


					setTimeout(function() {
						let fullCode = `<div class="decision" data-id="${token}${data["type"]}">${code}</div>`;
						document.querySelector("#instant-decision").innerHTML = fullCode;

						setTimeout(function() {
							document.querySelector("#instant-decision").classList.add("visible");
						}, 200);
					}, 300);
				}
			}
		}
	}).catch(console.error).finally(()=>{
		setTimeout(getInstantDecisionCalls, 500);
	});
}
function answerInstantDecision(target_token, type, option_index, description="") {
	document.querySelector("#instant-decision").classList.remove("visible");
	setTimeout(function() {
		document.querySelector("#instant-decision").innerHTML = "";
	}, 250);

	loadOldStage();

	Jarvis.instantDecisionAnswer(target_token, type, option_index, description).then(()=>{
		console.info("successfully submitted answer");
	}).catch(e=>{
		console.error("answerInstantDecision: ", e);
	});
}

function pickTextColorBasedOnBgColorSimple(bgColor, lightColor="#FFFFFF", darkColor="#000000") {
	var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
	var r = parseInt(color.substring(0, 2), 16); // hexToR
	var g = parseInt(color.substring(2, 4), 16); // hexToG
	var b = parseInt(color.substring(4, 6), 16); // hexToB
	return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
		darkColor : lightColor;
}
function pickTextColorBasedOnBgColorAdvanced(bgColor, lightColor="#FFFFFF", darkColor="#000000") {
	var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
	var r = parseInt(color.substring(0, 2), 16); // hexToR
	var g = parseInt(color.substring(2, 4), 16); // hexToG
	var b = parseInt(color.substring(4, 6), 16); // hexToB
	var uicolors = [r / 255, g / 255, b / 255];
	var c = uicolors.map((col) => {
		if (col <= 0.03928) {
			return col / 12.92;
		}
		return Math.pow((col + 0.055) / 1.055, 2.4);
	});
	var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
	return (L > 0.179) ? darkColor : lightColor;
}
  