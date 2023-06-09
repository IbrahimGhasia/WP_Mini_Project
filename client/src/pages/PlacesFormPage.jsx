import { useEffect, useState } from "react";
import PhotosUploader from "../PhotosUploader";
import PerksLabels from "../PerksLabels";
import axios from "axios";
import AccountNavigation from "../AccountNavigation";
import { Navigate, useParams } from "react-router-dom";

export default function PlacesFormPage() {
	const { id } = useParams();
	const [title, setTitle] = useState("");
	const [address, setAddress] = useState("");
	const [description, setDescription] = useState("");
	const [addedPhotos, setAddedPhotos] = useState([]);
	const [perks, setPerks] = useState([]);
	const [extraInfo, setExtraInfo] = useState("");
	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");
	const [maxGuests, setMaxGuests] = useState(1);
	const [price, setPrice] = useState(100);
	const [redirect, setRedirect] = useState(false);

	useEffect(() => {
		if (!id) return;
		axios.get("/places/" + id).then((response) => {
			const { data } = response;
			setTitle(data.title);
			setAddress(data.address);
			setDescription(data.description);
			setAddedPhotos(data.photos);
			setPerks(data.perks);
			setExtraInfo(data.extraInfo);
			setCheckIn(data.checkIn);
			setCheckOut(data.checkOut);
			setMaxGuests(data.maxGuests);
			setPrice(data.price);
		});
	}, [id]);

	const inputHeader = (label) => {
		return <h2 className="text-2xl mt-4">{label}</h2>;
	};

	const inputDescription = (text) => {
		return <p className="text-gray-500 text-sm">{text}</p>;
	};

	const preInput = (header, description) => {
		return (
			<>
				{inputHeader(header)}
				{inputDescription(description)}
			</>
		);
	};

	const savePlace = async (ev) => {
		ev.preventDefault();
		const placeData = {
			title,
			address,
			description,
			addedPhotos,
			perks,
			extraInfo,
			checkIn,
			checkOut,
			maxGuests,
			price,
		};
		if (id) {
			// update
			await axios.put("/places", {
				id,
				...placeData,
			});
		} else {
			// new place
			await axios.post("/places", placeData);
		}
		setRedirect(true);
	};

	if (redirect) return <Navigate to={"/account/places"} />;

	return (
		<>
			<div>
				<AccountNavigation />
				<form onSubmit={savePlace}>
					{preInput(
						"Title",
						"Title for your place, it should be small and catchy"
					)}
					<input
						type="text"
						placeholder="Title, for example: My lovely apt."
						value={title}
						onChange={(ev) => setTitle(ev.target.value)}
					/>
					{preInput("Address", "Address to this place")}
					<input
						type="text"
						placeholder="Address"
						value={address}
						onChange={(ev) => setAddress(ev.target.value)}
					/>
					{preInput("Photos", "More = Better")}
					<PhotosUploader
						addedPhotos={addedPhotos}
						onChange={setAddedPhotos}
					/>
					{preInput("Description", "Description of the place")}
					<textarea
						rows="5"
						value={description}
						onChange={(ev) => {
							setDescription(ev.target.value);
						}}
					/>
					{preInput("Perks", "Select all the perks of your place")}
					<div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
						<PerksLabels selected={perks} onChange={setPerks} />
					</div>
					{preInput("Extra-info", "House rules, etc")}
					<textarea
						value={extraInfo}
						onChange={(ev) => setExtraInfo(ev.target.value)}
					/>
					{preInput(
						"Check-In & Check-Out time",
						"Add check in and out times, remember to have some time window for cleaning the room between guests"
					)}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
						<div>
							<h3 className="mt-2 -mb-1">Check-in time</h3>
							<input
								type="text"
								placeholder="14:00"
								value={checkIn}
								onChange={(ev) => setCheckIn(ev.target.value)}
							/>
						</div>
						<div>
							<h3 className="mt-2 -mb-1">Check-out time</h3>
							<input
								type="text"
								placeholder="23:30"
								value={checkOut}
								onChange={(ev) => setCheckOut(ev.target.value)}
							/>
						</div>
						<div>
							<h3 className="mt-2 -mb-1">Max no. of guests</h3>
							<input
								type="number"
								placeholder="5"
								value={maxGuests}
								onChange={(ev) => setMaxGuests(ev.target.value)}
							/>
						</div>
						<div>
							<h3 className="mt-2 -mb-1">Price per night</h3>
							<input
								type="number"
								placeholder="100"
								value={price}
								onChange={(ev) => setPrice(ev.target.value)}
							/>
						</div>
					</div>
					<button className="primary my-4">Save</button>
				</form>
			</div>
		</>
	);
}
