export const inputPicker = () => {
	$(".clockPicker").clockpicker({
		placement: "top",
		align: "left",
		donetext: "Done"
	});
	// console.log($(".datePicker input"));
	$(".datePicker input").daterangepicker({
		singleDatePicker: true,
		showDropdowns: true,
		minYear: new Date().getFullYear,
		drops: "up",
		autoUpdateInput: true,
		locale: {
			format: "DD/MM/YYYY"
		}
	});
};
