"use strict";

import "../scss/main.scss";

import { catchClickEvent } from "./js-utility";
import { dropdownList } from "./drop-down-ui.js";
import { navDrop } from "./nav-drop";
import { inputPicker } from "./picker-ui";
import { autoCompleteLocation } from "./maps";

// Backend Scripts
import userForm from "./backend/userForm";
import profileForm from "./backend/profileForm";

// check if elements available in DOM for handling function calls
const isDropList = document.querySelector(".dropdown-list");
const isAutoComplete = document.querySelector('input[name="location"]');

// frontend calls
catchClickEvent();
isDropList && dropdownList();
navDrop();
inputPicker();
isAutoComplete && autoCompleteLocation();

// Backend calls
userForm();
profileForm();
