class Jarvis {
	static PORT = 2021;
	static HOST = "";
	static PSK = "";
	static TOKEN = "";
	static CONNECTED = false;

	static connect(host, psk, token) {
		Jarvis.HOST = host;
		Jarvis.PSK = psk;
		Jarvis.TOKEN = token;

		return new Promise(function(resolve, reject) {
			Jarvis._post(`${Jarvis._getUrl()}/register-device?name=Jarvis Desktop&token=${Jarvis.TOKEN}&type=desktop&native=true`, {psk:Jarvis.PSK}).then(d => {
				d = JSON.parse(d);
				
				if (d.success) {
					Jarvis.CONNECTED = true;
					resolve();
				} else {
					Jarvis.CONNECTED = false;
					reject(d.error);
				}
			}).catch(()=>{
				Jarvis.CONNECTED = false;
				reject()
			});;
		});
	}
	
	static reconnect(host, psk, token) {
		Jarvis.HOST = host;
		Jarvis.PSK = psk;
		Jarvis.TOKEN = token;
		
		return new Promise(function(resolve, reject) {
			Jarvis._post(`${Jarvis._getUrl()}/am-i-registered?token=${Jarvis.TOKEN}`, {psk:Jarvis.PSK}).then(d => {
				d = JSON.parse(d);
				
				if (d.success) {
					Jarvis.CONNECTED = true;
					resolve();
				} else {
					Jarvis.CONNECTED = false;
					reject();
				}
			}).catch(()=>{
				Jarvis.CONNECTED = false;
				reject()
			});
		})
	}

	static getProperty(token, prop) {
		return new Promise(function(resolve, reject) {
			if (!Jarvis.CONNECTED) { reject(); return; }
			Jarvis._post(`${Jarvis._getUrl()}/get-property${typeof prop == "undefined" ? "" : "?token="+token}`, {psk:Jarvis.PSK, property:(typeof prop == "undefined" ? token : prop)}).then(d => {
				d = JSON.parse(d);
				if (d.success) {
					resolve(d.result);
				} else {
					reject();
				}
			}).catch(()=>{reject()})
		});
	}

	static hello() {
		return new Promise(function(resolve, reject) {
			if (!Jarvis.CONNECTED) { reject(); return; }
			Jarvis._post(`${Jarvis._getUrl()}/hello?token=${Jarvis.TOKEN}`, {psk:Jarvis.PSK}).then(d => {resolve()}).catch(()=>{reject()});
		})
	}

	static instantDecisionScan(target_token, type) {
		return new Promise(function(resolve, reject) {
			if (!Jarvis.CONNECTED) { reject("not connected"); return; }

			let obj = {	psk:Jarvis.PSK	};
			if (typeof type != "undefined") {				obj.type = type;					}
			if (typeof target_token != "undefined") {		obj.target_token = target_token;	}

			Jarvis._post(`${Jarvis._getUrl()}/id/scan?token=${Jarvis.TOKEN}`, obj).then(d => {
				d = JSON.parse(d);
				if (d.success) {
					resolve(d.scan);
				} else {
					reject(d.error || "unknown error");
				}
			}).catch(e => {
				reject(e);
			});
		})
	}

	static instantDecisionAnswer(target_token, type, option_index, description="") {
		return new Promise(function(resolve, reject) {
			if (!Jarvis.CONNECTED) { reject("not connected"); return; }

			Jarvis._post(`${Jarvis._getUrl()}/id/answer?token=${Jarvis.TOKEN}`, {
				target_token: target_token,
				type: type,
				option: option_index,
				description: description
			}).then(d => {
				d = JSON.parse(d);
				if (d.success) {
					resolve();
				} else {
					reject();
				}
			}).catch(e => {
				reject(e);
			});
		});
	}


	static _getUrl() {
		return `http://${Jarvis.HOST}:${Jarvis.PORT}`;
	}

	static _post(url, jsonData) {
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						resolve(xhr.responseText);
					} else {
						reject(xhr.status);
					}
				}
			};
			xhr.onerror = function () {
				reject("host or port unreachable");
			};
			var data = JSON.stringify(jsonData);
			xhr.send(data);
		});
	}
}