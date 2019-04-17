import axios from "../backend/axios";
import { getFormData, notificationFlash } from "./helper";

export const eventCheckout = async form => {
	const { stripeToken: token, event } = getFormData(
		Array.from(form.querySelectorAll("input"))
	);
	// process event checkout form
	const {
		status,
		data: { success }
	} = await axios.post(`/checkout/connect/event/${event}`, { token });
	// show alert for success response
	if (status === 200) {
		notificationFlash("success", success.msg);
		setTimeout(() => window.location.reload(), 1500);
	}
};
