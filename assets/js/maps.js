/**
 *  * Location Field Autocompletion
 *  	TODO #1 : Select location input and passed it to places API AutoComplet method
 * 	TODO #2 : Listen for place change event and getplace details
 * 	TODO #3 : Extract lng and lat from place details and set it on location input data attribute
 *  *Finished
 */

export const autoCompleteLocation = () => {
	// TODO #1:
	const locationInput = document.querySelector('input[name="location"]');
	const autocomplete = new google.maps.places.Autocomplete(locationInput);
	// TODO #2:
	autocomplete.addListener("place_changed", () => {
		const place = autocomplete.getPlace();
		// TODO #3:
		const [lng, lat] = [
			place.geometry.location.lng(),
			place.geometry.location.lat()
		];
		locationInput.setAttribute("data-coordinates", `${lng},${lat}`);
	});
};
