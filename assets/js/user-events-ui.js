export default () => {
	const actionBtns = document.querySelectorAll("#action");

	//TODO : Listen for click event on each action button
	actionBtns.forEach(actionBtn => {
		actionBtn.addEventListener("click", function() {
			// TODO : Select sibling of parent i.e. actions and display it
			const actions = this.offsetParent.nextElementSibling;
			actions.style.display = "block";
			// TODO : Hide sibling when user leave the area
			actions.addEventListener("mouseleave", function() {
				this.style.display = "none";
			});
		});
	});
};
