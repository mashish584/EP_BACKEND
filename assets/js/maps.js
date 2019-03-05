export const autoCompleteLocation = () => {
	const locationInput = document.querySelector('input[name="location"]');
	const autocomplete = new google.maps.places.Autocomplete(locationInput);
	autocomplete.addListener("place_changed", () => {
		const place = autocomplete.getPlace();
		const [lat, lng] = [place.geometry.location.lat(), place.geometry.location.lng()];
		locationInput.setAttribute("data-coordinates", `${lat},${lng}`);
	});
};
