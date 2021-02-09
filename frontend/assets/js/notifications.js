const EXCLUDED_APPS = [
	"Android-System",
	"Google",
	"Oberfläche",
	"AccuBattery",
	"Canva"
];

function getNotifications() {
	Jarvis.getProperty("notifications").then(devices => {
		let code = "";
		
		try {	
			for (const token in devices) {
				if (devices.hasOwnProperty(token)) {
					if ("notifications" in devices[token]) {
						devices[token].notifications.sort((a,b) => ('' + a["sender"]).localeCompare(b["sender"]) || ('' + a["icon"]).localeCompare(b["icon"]) ).forEach(notif => {
							try {
								if (notif.title == null) { return; }
								if (EXCLUDED_APPS.includes(notif.sender)) { return; }
								if (notif.message == null) { notif.message = ""; }
								code += `<div class="notification" onclick="showNotification(this, '${notif.title.replaceAll('"', '\\u0022').replaceAll("'", "\\u0027")}', '${notif.message.replaceAll('"', '\\u0022').replaceAll("'", "\\u0027")}')"><img src="data:image/png;base64,${notif.icon}"></div>`;					
							} catch (err) {
								console.error(err);
							}
						});
					}
				}
			}
		} catch (err) {
			console.error(err);
		}

		document.getElementById("notifications").innerHTML = code;
		setTimeout(getNotifications, 1000);
	}).catch(_ => {
		setTimeout(getNotifications, 1000);
	});
}

let lastElement = null;
document.querySelector("body").addEventListener("click", e => {
	if (
		// document.querySelector("#notification-details").contains(e.target)
		// ||
		document.querySelector("#notifications").contains(e.target)
		) {

	} else {
		hideNotifications();
	}
})
function showNotification(element, title, message) {
	if (lastElement == element) { hideNotifications(); }
	lastElement = element;
	document.querySelector("#notification-details > .content").innerHTML = `<p>${title}</p><p>${message}</p>`
	document.querySelector("#notification-details").classList.add("visible");
	document.querySelector("#notification-details > .rect")
}
function hideNotifications() {
	document.querySelector("#notification-details").classList.remove("visible");
}