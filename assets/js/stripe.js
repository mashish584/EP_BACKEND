import { eventCheckout } from "./backend/processCheckout";

export default form => {
	// stripe client
	const stripe = Stripe("pk_test_pT520Fy5NYzKPY5aVN5uCD0q00af9MsHzZ");
	// instance of stripe elements
	const elements = stripe.elements();
	// elements style
	var style = {
		base: {
			color: "#32325d",
			fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
			fontSmoothing: "antialiased",
			fontSize: "16px",
			"::placeholder": {
				color: "#aab7c4"
			}
		},
		invalid: {
			color: "#fa755a",
			iconColor: "#fa755a"
		}
	};
	// instance of card element
	const card = elements.create("card", { style });
	// mound card on 'card-element'
	card.mount("#card-element");
	// Handle real-time validation errors from the card Element.
	card.addEventListener("change", function(event) {
		var displayError = document.getElementById("card-errors");
		if (event.error) {
			displayError.textContent = event.error.message;
		} else {
			displayError.textContent = "";
		}
	});
	// Handle form submission.

	form.addEventListener("submit", function(event) {
		event.preventDefault();

		stripe.createToken(card).then(function(result) {
			if (result.error) {
				// Inform the user if there was an error.
				const errorElement = document.getElementById("card-errors");
				errorElement.textContent = result.error.message;
			} else {
				// Send the token to your server.
				stripeTokenHandler(result.token);
			}
		});
	});

	// Submit the form with the token ID.
	function stripeTokenHandler(token) {
		// Insert the token ID into the form so it gets submitted to the server
		var hiddenInput = document.createElement("input");
		hiddenInput.setAttribute("type", "hidden");
		hiddenInput.setAttribute("name", "stripeToken");
		hiddenInput.setAttribute("value", token.id);
		form.appendChild(hiddenInput);

		// process checkout
		eventCheckout(form);
	}
};
