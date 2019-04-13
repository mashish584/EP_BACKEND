function toggleDropNav(elem) {
	// if any element has .show-dropnav remove it
	const activeDropNavElement = document.querySelector(".show-dropnav");
	if (activeDropNavElement && activeDropNavElement !== elem) {
		activeDropNavElement.classList.remove("show-dropnav");
	}
	// toggle
	elem.classList.contains("show-dropnav")
		? elem.classList.remove("show-dropnav")
		: elem.classList.add("show-dropnav");
}

export const navDrop = () => {
	const dropBtns = document.querySelectorAll('[data-target="subMenu"]');
	dropBtns.forEach(btn => {
		btn.addEventListener("click", ({ target }) => {
			console.log(target.classList);
			if (target.classList.contains("ring")) {
				target.classList.remove("ring");
			}
			toggleDropNav(btn.nextElementSibling);
		});
	});
};
