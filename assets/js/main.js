"use strict";

import "../scss/main.scss";

import "moment";
import { catchClickEvent, toggleCheckout } from "./js-utility";
import { dropdownList } from "./drop-down-ui.js";
import { navDrop } from "./nav-drop";
import { inputPicker } from "./picker-ui";
import { autoCompleteLocation } from "./maps";
import userEventsActionUi from "./user-events-ui";
import stripe from "./stripe";

// Backend Scripts
import userForm from "./backend/userForm";
import profileForm from "./backend/profileForm";
import eventForm from "./backend/eventForm";
import commentForm from "./backend/commentForm";

// check if elements available in DOM for handling function calls
const isDropList = document.querySelector(".dropdown-list");
const isAutoComplete = document.querySelector('input[name="location"]');
const p_form = document.getElementById("payment-form");
const toggleModalEls = document.querySelectorAll("#toggleModal");

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

// Backend calls
userForm();
profileForm();
eventForm();
commentForm();
