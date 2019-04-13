import moment from "moment";

export default () => {
	// Enable pusher logging - don't include this in production
	Pusher.logToConsole = true;

	// Creating notification element
	function createNotificationElement({ user, message, time }) {
		return `<a class="notification-item" href="">
		<img src="${user.profileImg}">
		<div>
			<span>${user.fullname}</span>
			<p>${message}</p>
			<small>${moment(time).fromNow()}</small>
		</div>
		</a>`;
	}

	let pusher = new Pusher("19f2c027bc35d1444d51", {
		cluster: "ap2"
		// forceTLS: true
	});

	fetch("/api/me")
		.then(response => response.json())
		.then(({ userId }) => {
			if (userId) {
				const channel = pusher.subscribe(`user-${userId}`);
				channel.bind("notify", function(data) {
					const notifContainer = document.querySelector(
						"#notificationContainer"
					);
					// add .ring in notification-btn
					document.querySelector(".notification-btn").classList.add("ring");
					// remove if last element is p
					if (notifContainer.lastElementChild.nodeName.toLowerCase() === "p") {
						notifContainer.lastElementChild.remove();
					}
					// add notification in container
					notifContainer.insertAdjacentHTML(
						"afterbegin",
						createNotificationElement(data)
					);
				});
			}
		});
};
