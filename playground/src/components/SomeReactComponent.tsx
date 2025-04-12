import { useEffect } from "react"
import { callRoute } from "typed-rest-routes/client";

export const SomeReactComponent = ({ request_id = "React Component" }) => {
	const handleApi = async () => {
		return await callRoute("/api", "POST", {
			id: request_id,
		});
	}

	useEffect(() => {
		handleApi().then((res) => {
			console.log(res);
		});
	}, []);

	return (
		<>
			<p>The browser console should show two responses, one from the server and one from the client:</p>
			<code>
				Hello, Astro Component!<br />
				Hello, React Component!<br />
			</code>
		</>
	)
}