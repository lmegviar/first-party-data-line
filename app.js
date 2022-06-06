/* Message Configurations ---------------------------------------------- */

const messages = {
	VERIFY_AGE: {
		msg: [
			"This Artwork is intended for audiences 13 and older.", 
			"Please confirm your birthdate to continue."
		],
		primary: {
			msg: "I am 13 or older",
			action: () => {
				displayMessage("VERIFY_VPN");
				userData.over13 = true;
			}
		},
		secondary:{
			msg: "Leave",
			action: () => window.history.back()
		},
	},
	VERIFY_VPN: {
		msg: [
			"The Artist encourages disabling VPNs (Virtual Private Networks) for the best viewing experience.", 
			"Are you using a VPN?"
		],
		primary: {
			msg: "No",
			action: () => displayMessage("TRUST_IN_ART")
		},
		secondary:{
			msg: "Yes",
			action: () => displayMessage("DISABLE_VPN")
		},
	},
	DISABLE_VPN: {
		msg: [
			"Please disable your VPN to continue.",
			"You can trust The Artist.",
		],
		primary: {
			msg: "I've disabled my VPN",
			action: () => displayMessage("TRUST_IN_ART")
		},
		secondary: {
			msg: "Leave",
			action: () => window.history.back()
		}
	},
	TRUST_IN_ART: {
		msg: [
			"Trust is essential to the creation and appreciation of art.",
			"The Artist trusts that you've been honest so far."
		],
		primary: {
			msg: "I've been honest.",
			action: () => {
				userData.honest = true;
				displayCookieMessage();
			}
		},
		secondary: {
			msg: "Let me try again.",
			action: () => {
				userData.honest = false;
				displayMessage("VERIFY_AGE");
			}
		}
	},
	BROWSER: {
		msg: [],
		primary: {
			msg: "Continue",
			action: () => {displayLocationMessage()}
		}
	},
	COOKIES_ENABLED: {
		msg: [
			"You have cookies enabled on your browser.", 
			"Don't worry - The Artist would never exploit this for tracking purposes."
		],
		primary: {
			msg: "Continue",
			action: () => displayBrowserMessage()
		}
	},
	COOKIES_DISABLED: {
		msg: [
			"You have cookies disabled on your browser.", 
			"I understand your concern, but don't worry - The Artist would never exploit you."
		],
		primary: {
			msg: "Continue",
			action: () => displayBrowserMessage()
		}
	},
	NAVIGATOR_LOCATION: {
		msg: [
			"You trust The Artist with your location.",
		],
		primary: {
			msg: "Continue",
			action: () => displayMessage("CONTACT_ARTIST")
		}
	},
	IP_LOCATION: {
		msg: [
			"You don't want The Artist to know your location.",
			"That's understandable in today's world.",
		],
		primary: {
			msg: "Continue",
			action: () => displayMessage("CONTACT_ARTIST")
		}
	},
	PLEASE_STAY: {
		msg: [
			"Please don't go!",
			"Give The Artist one more chance."
		],
		primary: {
			msg: "Continue",
			action: () => displayMessage(getLastMessage())
		}
	},
	ART_SOON: {
		msg: [
			"We'll get to The Art soon.",
			"But first, let The Artist get to know you."
		],
		primary: {
			msg: "Continue",
			action: () => displayMessage(getLastMessage())
		}
	},
	CONTACT_ARTIST: {
		msg: [
			"You've shared so much.",
			"Now it's time for The Artist to give back.",
			"Ask The Artist anything you like:"
		],
		textInput: {
			id: "question-field",
			placeholder: "Enter your question here.",
			submit: {
				msg: "Send",
				action: () => sendMessage(document.getElementById("question-field").value)
			}
		}
	},
	ARTIST_UNAVAILABLE: {
		msg: [
			"The artist is currently unavailable."
		],
		primary: {
			msg: "Try again",
			action: () => displayMessage("CONTACT_ARTIST")
		}
	}
}

/* User data store ---------------------------------------------- */

const userData = {
	ipAddress: null,
	cookieEnabled: null,
	language: null,
	languages: [],
	appCodeName: null,
	currentPosition: null,
	honest: null,
	oscpu: null,
	mobile: null,
	blockedLocation: false,
	over13: null,
	messagesViewed: [] // ids of messages viewed by user in order of appearance
}

/* Helper Functions ---------------------------------------------- */

const addDetailsFromNavigator = () => {
	const fields = [
		// "languages",
		// "language",
		"cookieEnabled",
		"appCodeName",
		"oscpu"
	]
	fields.forEach((field) => {
		userData[field] = navigator[field];
	});
};

const addInputs = (message) => {
	// clear previous inputs
	inputsEl.innerHTML = "";
	for (key in message) {
		switch(key) {
			case "primary":
				inputsEl.append(makeButton(message.primary))
				break;
			case "secondary":
				inputsEl.prepend(makeButton(message.secondary, false))
				break;
			case "textInput":
				inputsEl.append(makeTextInput(message.textInput))
				break;
			// case "dateInput":
			// 	inputsEl.append(makeDateInput(message.textInput))
			// 	break;
		}
	}
};

const addIPAddress = async () => {
	const IP_FETCHER_URL = "https://api.ipify.org?format=json";
	let res = await fetch(IP_FETCHER_URL);
	let data = await res.json();
	userData.ipAddress = data.ip; 
};

// via https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
const addMobile = () => {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  userData.mobile = check;
};

const displayArtistResponse = (response, question) => {
	displayMessage({
		msg: [
			`You asked: "${question}"`,
			`The Artist replied: "${response}"`
		],
		primary: {
			msg: "Ask another question",
			action: () => displayMessage("CONTACT_ARTIST")
		}
	});
}

const displayBrowserMessage = () => {
	messages.BROWSER.msg.push(`I notice you're using a ${userData.appCodeName} browser on ${userData.oscpu}.`);
	if (userData.mobile) {
		messages.BROWSER.msg.push("You're viewing this art from a mobile device as well. How wonderful that you can connect with The Artist from anywhere.");
	} else {
		messages.BROWSER.msg.push("How wonderful, The Artist uses similar technology.");
	}
	displayMessage("BROWSER")
};

const displayCookieMessage = () => {
	userData.cookieEnabled ? displayMessage("COOKIES_ENABLED") : displayMessage("COOKIES_DISABLED");
};

const displayLocationMessage = () => {
	const success = (data) => {
		userData.currentPosition = data;
		[
			`Latitude: ${data.coords.latitude}`,
			`Longitude: ${data.coords.longitude}`,
			"For this, you will be rewarded."

		].forEach(msg => messages.NAVIGATOR_LOCATION.msg.push(msg))
		displayMessage("NAVIGATOR_LOCATION");
	}
	const error = () => {
		userData.blockedLocation = true;
		messages.IP_LOCATION.msg.push(`The Artist respects your decision and won't use your Internet Provider Address ${userData.ipAddress ? "(" + userData.ipAddress + ") " : ""}to find your location without permission.`);
		displayMessage("IP_LOCATION");
	}
	getUserLocation(success, error);
};

const displayMessage = (msgId) => {
	// clear previous message
	currentMessageEl.innerHTML = "";
	const message = messages[msgId];
	message.msg.forEach((line) => {
		const text = document.createElement("p");
		text.innerHTML = line;
		currentMessageEl.append(text);
	});
	addInputs(message, currentMessageEl);
	let viewed = userData.messagesViewed;
	if (!viewed.length || viewed[viewed.length - 1] !== msgId) {
		viewed.push(msgId);
	}
};

const getLastMessage = () => {
	const viewed = userData.messagesViewed;
	let last = viewed[viewed.length - 2] || viewed[viewed.length - 1] || messages["VERIFY_AGE"]; // default to first screen
	// Don't return "PLEASE_STAY" or "ART_SOON" to avoid an infinite loop
	return ["PLEASE_STAY", "ART_SOON"].includes(last.id) ? messages["VERIFY_AGE"] : last;

};

const getUserLocation = (success, error) => {
	// handle user denied prompt
	const callback = (data) => {console.log(data)};
	navigator.geolocation.getCurrentPosition(success, error, {
		enableHighAccuracy: true
	});
};

const makeButton = (button, primary=true) => {
	let btnEl = document.createElement("button");
	btnEl.innerHTML = button.msg;
	btnEl.onclick = button.action;
	if (primary) {
		btnEl.classList.add("primary");
	}
	return btnEl;
};

// const makeDateInput = (action) => {
// 	// To Do - have user confirm birthdate and save
// }

const makeTextInput = (input, action) => {
	let containerEl = document.createElement("div");
	let inputEl = document.createElement("input");
	let btnEl = document.createElement("button");
	containerEl.append(inputEl);
	containerEl.append(btnEl);
	inputEl.type = "text";
	inputEl.id = input.id;
	inputEl.placeholder = input.placeholder || "Enter your response here.";
	btnEl.classList.add("submit");
	btnEl.classList.add("primary");
	btnEl.innerHTML = input.submit.msg || "Send";
	btnEl.onclick = input.submit.action;
	return containerEl;
};

const pollForResponse = (question) => {
	// To Do
	// Poll responses for up to 5 minutes
	let response;
	if (response) {
		displayArtistResponse(response, question);
	} else {
		displayMessage("ARTIST_UNAVAILABLE");
	}
};

const sendMessage = (msg) => {
	// TO DO
 	pollForResponse();
};

const getUserDataFromBrowser = async () => {
	addDetailsFromNavigator();
	addMobile();
	await addIPAddress();
};

/* ---------------------------------------------- */

const currentMessageEl = document.getElementById("current-message");
const inputsEl = document.getElementById("inputs");
const dialog = document.getElementById("dialog-box");
const dismiss = document.querySelector(".dismiss");

// handle dismiss click
dismiss.onclick = () => {
	displayMessage("PLEASE_STAY");
}

// handle user click outside of dialog
window.onclick = function(event) {
  if (event.target == dialog) {
    displayMessage("ART_SOON");
  }
} 

const run = async () => {
	// Display first message
	displayMessage("VERIFY_AGE");
	// Get base data for user
	await getUserDataFromBrowser();
};

run();
