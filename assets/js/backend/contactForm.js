import axios from "./axios";
import { getFormData, asyncErrorHandler } from "./helper";

export default () => {
	const contactForm = document.querySelector("#contactForm");
	contactForm &&
		contactForm.addEventListener(
			"submit",
			asyncErrorHandler(async function(e) {
				e.preventDefault();

				// TODO #1 :
				const [inputEls, textarealEls] = [
					Array.from(this.querySelectorAll("input")),
					Array.from(this.querySelectorAll("textarea"))
				];
				const body = getFormData([...inputEls, ...textarealEls]);

				// TODO #2:
				const { data, status } = await axios.post("/contact", body);
				if (status === 200) {
					alert(data.success.msg);
				}
			})
		);
};
