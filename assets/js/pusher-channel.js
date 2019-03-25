export default () => {
	// Enable pusher logging - don't include this in production
	Pusher.logToConsole = true;

	var pusher = new Pusher("19f2c027bc35d1444d51", {
		cluster: "ap2"
		// forceTLS: true
	});

	fetch("/api/me")
		.then(response => response.json())
		.then(({ userId }) => {
			if (userId) {
				const channel = pusher.subscribe(`user-${userId}`);
				channel.bind("notify", function(data) {
					alert(JSON.stringify(data));
				});
			}
		});
};
