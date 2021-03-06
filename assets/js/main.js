"use strict";

import "../scss/main.scss";

import "moment";
import { catchClickEvent, toggleCheckout } from "./js-utility";
import { dropdownList } from "./drop-down-ui.js";
import { navDrop } from "./nav-drop";
import { inputPicker } from "./picker-ui";
import { autoCompleteLocation } from "./maps";
import userEventsActionUi from "./user-events-ui";
import channelNotifications from "./pusher-channel";
import stripe from "./stripe";

// Backend Scripts
import userForm from "./backend/userForm";
import profileForm from "./backend/profileForm";
import eventForm from "./backend/eventForm";
import commentForm from "./backend/commentForm";
import contactForm from "./backend/contactForm";

// check if elements available in DOM for handling function calls
const isDropList = document.querySelector(".dropdown-list");
const isAutoComplete = document.querySelector('input[name="location"]');
const p_form = document.getElementById("payment-form");
const toggleModalEls = document.querySelectorAll("#toggleModal");
const notifFlash = document.querySelector(".notif-flash");

toggleModalEls.forEach(btn => btn.addEventListener("click", toggleCheckout));

// frontend calls
catchClickEvent();
isDropList && dropdownList();
navDrop();
inputPicker();
isAutoComplete && autoCompleteLocation();
userEventsActionUi();
p_form && stripe(p_form);
toggleCheckout;
channelNotifications();

// Backend calls
userForm();
profileForm();
eventForm();
commentForm();
contactForm();

// Hide flash
notifFlash.addEventListener("click", e => {
	console.log(e.target.id);
	if (e.target.id === "closeFlash") {
		notifFlash.classList.remove("alert");
		notifFlash.classList.remove("success");
	}
});
