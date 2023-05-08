import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNavigation from "../AccountNavigation";

export default function ProfilePage() {
	const { user, setUser, ready } = useContext(UserContext);
	const [redirect, setRedirect] = useState(null);
	let { subpage } = useParams();
	if (subpage === undefined) subpage = "profile";

	if (!ready) {
		return "Loading . . .";
	}

	if (ready && !user && !redirect) {
		return <Navigate to={"/login"} />;
	}

	async function logout() {
		await axios.post("/logout");
		setRedirect("/");
		setUser(null);
	}

	if (redirect) {
		return <Navigate to={redirect} />;
	}

	return (
		<div>
			<AccountNavigation />
			{subpage === "profile" && (
				<div className="text-center max-w-xl mx-auto">
					Logged In as {user.name} ({user.email})<br />
					<button onClick={logout} className="primary max-w-md mt-2">
						Logout
					</button>
				</div>
			)}

			{subpage === "places" && <PlacesPage />}
		</div>
	);
}
