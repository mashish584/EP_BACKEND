import "../scss/main.scss";

import { catchClickEvent } from "./js-utility";
import { dropdownList } from "./drop-down-ui.js";
import { navDrop } from "./nav-drop";
import { inputPicker } from "./picker-ui";
import { autoCompleteLocation } from "./maps";

// check if elements available in DOM for handling function calls
const isDropList = document.querySelector(".dropdown-list");
const isAutoComplete = document.querySelector('input[name="location"]');

// function calls
catchClickEvent();

if (isDropList) {
	dropdownList();
}

navDrop();
inputPicker();

if (isAutoComplete) {
	autoCompleteLocation();
}
