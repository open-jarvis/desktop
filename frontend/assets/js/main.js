function get(url, args={}) {
	url = (url.includes("?") ? url + "&_no_cache=" + Date.now() : url + "?_no_cache=" + Date.now());
	console.log("[get]", url);
	return new Promise(function(accept, reject) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() { 
			if (xmlHttp.readyState == 4) {
				if (xmlHttp.status == 200) {
					accept(xmlHttp.responseText)
				} else {
					reject();
				}
			}
		}

		for (x in args) {
			xmlHttp[x] = args[x];
		}

		xmlHttp.open("GET", url, true); 
		xmlHttp.send(null);
	});
}


["pre-shared-key", "token", "host"].forEach(id => {
	document.getElementById(id).addEventListener("keyup", e => {
		if (e.key === 'Enter' || e.keyCode === 13) {
			if (document.getElementById("host").value != "" && document.getElementById("pre-shared-key").value != "" && document.getElementById("token").value != "") {
				document.querySelector("#lock > .icon").classList.add("loading");
				Jarvis.connect(document.getElementById("host").value, document.getElementById("pre-shared-key").value, document.getElementById("token").value).then(_=>{
					StatusDot.GREEN;
					Siri.SILENT;
					
					document.getElementById("lock").classList.add("fade");
					document.querySelector("#lock > .icon").classList.remove("loading");					
					
					localStorage["psk"] = Jarvis.PSK;
					localStorage["host"] = Jarvis.HOST;
					localStorage["token"] = Jarvis.TOKEN;

					setTimeout(function() {
						document.getElementById("lock").classList.add("hidden");
					}, 250);
				}).catch(msg => {
					document.querySelector("#lock > .icon").classList.remove("loading");
					document.getElementById("pre-shared-key").value = "";
					document.getElementById("token").value = "";
				});
			}
		}
	});
});

if (typeof localStorage["psk"] != "undefined") { document.getElementById("pre-shared-key").value = localStorage["psk"] }
if (typeof localStorage["token"] != "undefined") { document.getElementById("token").value = localStorage["token"] }
if (typeof localStorage["host"] != "undefined") { document.getElementById("host").value = localStorage["host"] }

if (typeof localStorage["psk"] != "undefined" &&
	typeof localStorage["token"] != "undefined" &&
	typeof localStorage["host"] != "undefined" ) {
	
	document.querySelector("#lock > .icon").classList.add("loading");

	Jarvis.reconnect(localStorage["host"], localStorage["psk"], localStorage["token"]).then(_=> {
		StatusDot.GREEN;
		Siri.SILENT;
		
		document.querySelector("#lock > .icon").classList.remove("loading");					
				
		document.getElementById("lock").classList.add("fade");
		setTimeout(function() {
			document.getElementById("lock").classList.add("hidden");
		}, 250);
	}).catch(e => {
		document.querySelector("#lock > .icon").classList.remove("loading");
		document.getElementById("pre-shared-key").value = "";
		document.getElementById("token").value = "";
	});
}

getNotifications();
setInterval(Jarvis.hello, 12 * 1000);

getInstantDecisionCalls();