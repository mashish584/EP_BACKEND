import { lastClickEl } from "./js-utility";

function toggleDropDown(mode = "add") {
	this.classList[mode]("show-list");
}

function updateScrollPosition(dropdownList) {
	const activeElement = dropdownList.querySelector("li.active");
	if (activeElement.offsetTop > 280) {
		dropdownList.scrollTop = activeElement.offsetTop - 280;
	} else {
		dropdownList.scrollTop = 0;
	}
}

function setSelectValue(input, dropdownList) {
	const activeElement = dropdownList.querySelector("li.active");
	input.value = activeElement
		? activeElement.textContent
		: dropdownList.querySelector("li").textContent;
}

function triggerListItem(data) {
	const { activeElement, action } = data;

	const triggerItem = () => {
		if (action === "previousElementSibling") {
			this.lastElementChild.classList.add("active");
		} else {
			this.firstElementChild.classList.add("active");
		}
	};

	if (!activeElement) {
		triggerItem();
	} else {
		if (activeElement[action]) {
			activeElement.classList.remove("active");
			activeElement[action].classList.add("active");
		} else {
			activeElement.classList.remove("active");
			triggerItem();
		}
	}
}

export const dropdownList = () => {
	const dropList = document.querySelector(".trigger-list");
	const dropDownContainer = dropList.parentElement.querySelector(".dropdown-list");

	// attaching events on selectInput
	dropList.addEventListener("focus", () => toggleDropDown.call(dropDownContainer));
	dropList.addEventListener("blur", () => {
		if (lastClickEl.parentElement.classList.contains("dropdown-list")) {
			dropDownContainer.querySelector("li.active").classList.remove("active");
			lastClickEl.classList.add("active");
			updateScrollPosition(dropDownContainer);
			setSelectValue(dropList, dropDownContainer);
		}
		toggleDropDown.call(dropDownContainer, "remove");
	});
	dropList.addEventListener("keydown", e => {
		const { keyCode: code } = e;
		// stop the document scroll position from change
		e.preventDefault();

		// keydown
		if (code === 40) {
			const activeElement = dropDownContainer.querySelector("li.active");
			triggerListItem.call(dropDownContainer, {
				activeElement,
				action: "nextElementSibling"
			});
			updateScrollPosition(dropDownContainer);
			setSelectValue(dropList, dropDownContainer);
		}

		// keyup
		if (code === 38) {
			const activeElement = dropDownContainer.querySelector("li.active");
			triggerListItem.call(dropDownContainer, {
				activeElement,
				action: "previousElementSibling"
			});
			updateScrollPosition(dropDownContainer);
			setSelectValue(dropList, dropDownContainer);
		}

		//enter
		if (code === 13) dropList.blur();
	});

	// update scroll position based on active item
	updateScrollPosition(dropDownContainer);

	// setting default value for drop-list input
	setSelectValue(dropList, dropDownContainer);
};
