"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useBalance, useNetwork } from "wagmi";
import { useSignMessage } from "wagmi";
import { useNotification, NotificationProvider } from "@web3uikit/core";
import { BsFillBellFill } from "react-icons/bs";
import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Button } from "@mui/material";
import {
	GiPineapple,
	GiOrangeSlice,
	GiShinyApple,
	GiStrawberry,
	GiVote,
} from "react-icons/gi";
import { GrView } from "react-icons/gr";
import axios from "axios";

const Main = () => {
	const [voteFruit, setVoteFruit] = useState({
		fruit: "",
		chainId: "",
	});
	const [getFruit, setGetFruit] = useState({
		fruit: "",
		chainId: "",
	});
	const [checkResult, setCheckResult] = useState(false);
	const [processVote, setProcessVote] = useState(false);
	const [displaypage, setDisplayPage] = useState(false);
	const { address, isConnected, isConnecting } = useAccount();
	const { chain, chains } = useNetwork();
	const dispatch = useNotification(); // tool to handle all notifications...

	const handleNewNotification = (msg: string, type: string) => {
		dispatch({
			type: type,
			message: msg,
			title: "New Notification",
			position: "topR",
			icon: <BsFillBellFill />,
		});
	};

	// hook to monitor if user signed into metamask
	const {
		data,
		isError: signedError,
		isSuccess: signedSuccess,
		signMessage,
	} = useSignMessage({
		message: `Hello fren you are about to vote for ${voteFruit.fruit} Click SIGN to  cast Vote`,
	});

	// update state of the chainID once wallet is connected...
	useEffect(() => {
		if (isConnected) {
			setVoteFruit((prev: any) => {
				return { ...prev, chainId: chain!.id };
			});
			setGetFruit((prev: any) => {
				return { ...prev, chainId: chain!.id };
			});
			setDisplayPage(true);
		} else {
			setDisplayPage(false);
		}
	}, [isConnected, isConnecting]);

	// automatically makes a vote once the user has signed in in successfully
	useEffect(() => {
		if (signedSuccess) {
			const submitVote = async () => {
				try {
					const response = await axios.post(
						"https://helaserver.onrender.com/api/v1/fruits/vote",
						voteFruit
					);

					const info: unknown = (
						<div>
							<p> {response.data.data.message}</p>
							TX:
							{response.data.data.hash}`;
						</div>
					);
					handleNewNotification(info as string, "success");
					console.log(response.data);
					setProcessVote(false);
				} catch (err: any) {
					console.log(err);
					handleNewNotification(err.message, "error");
					setProcessVote(false);
				}
			};
			submitVote();
		}
		if (signedError) {
			setProcessVote(false);
		}
	}, [signedSuccess, signedError]);

	// handle select option to store input value when a user selects a fruit to vote
	const handleVote = (event: any) => {
		const { name, value } = event.target;
		console.log(value);
		setVoteFruit((prev) => {
			return { ...prev, [name]: value.toLowerCase() };
		});
	};

	// handle select option to store input value when a user selects a fruit to get vote count
	const handleGetVote = (event: any) => {
		const { name, value } = event.target;
		setGetFruit((prev) => {
			return { ...prev, [name]: value.trim().toLowerCase() };
		});
	};

	// function to vote
	const handleSumbitVote = async (event: any) => {
		event.preventDefault();
		{
			!isConnected && (
				<div>
					<h1>Connect Wallet to Access Vote</h1>
				</div>
			);
		}
		if (voteFruit.fruit == "") {
			handleNewNotification("what Fruit?", "error");
		} else {
			setProcessVote(true);
			signMessage();
		}
		// console.log(window.ethereum);
	};

	// function to check vote
	const checkVote = async (event: any) => {
		event.preventDefault();
		if (getFruit.fruit == "") {
			handleNewNotification("what Fruit?", "error");
		} else {
			setCheckResult(true); //changes the state of the check vote button to processing...
			try {
				const response = await axios.post(
					"https://helaserver.onrender.com/api/v1/fruits/getvote",
					getFruit
				);
				const info = `What do we have here!!!! ${response.data.data.data} has ${response.data.data.vote} votes`;
				handleNewNotification(info, "success"); // dispaly the result as a notification
				setCheckResult(false); //changes the state of the check vote button  back to vote...
			} catch (err: any) {
				setCheckResult(false); //changes the state of the check vote button back to vote...
				handleNewNotification(err.message, "error"); // dispaly the result as a notification
			}
		}
	};

	return (
		<>
			{displaypage && (
				// vote form...
				<div className="lg:flex" style={{ margin: "0 auto", width: "50%" }}>
					<div>
						<FormControl sx={{ m: 1, minWidth: 250 }}>
							<InputLabel id="demo-simple-select-autowidth-label">
								Select
							</InputLabel>
							<Select
								labelId="demo-simple-select-autowidth-label"
								id="demo-simple-select-autowidth"
								onChange={handleVote}
								autoWidth
								label="vote"
								name="fruit"
							>
								<MenuItem value="">
									<em>Select Fruit to Vote</em>
								</MenuItem>
								<MenuItem value="Apple">
									Apple <GiShinyApple />
								</MenuItem>
								<MenuItem value="Orange">
									Orange <GiOrangeSlice />
								</MenuItem>
								<MenuItem value="pineApple">
									PineApple <GiPineapple />
								</MenuItem>
								<MenuItem value="strawberry">
									Strawberry <GiStrawberry />
								</MenuItem>
							</Select>
							<Button
								variant="contained"
								color="secondary"
								size="large"
								onClick={handleSumbitVote}
								disabled={processVote} // when a fecth result has been initiated the button disables...
							>
								{!processVote ? (
									<div>
										Vote <GiVote />
									</div>
								) : (
									<div className="flex gap-2">
										<div className="spinner-container"></div>
										<div className="spinner border-t-4 border-blue-500 border-solid h-4 w-4 rounded-full animate-spin"></div>
										Voting please wait...
									</div>
								)}
							</Button>
						</FormControl>
					</div>

					{/* to process the result form */}
					<div>
						<FormControl sx={{ m: 1, minWidth: 250 }}>
							<InputLabel id="demo-simple-select-autowidth-label">
								Select
							</InputLabel>
							<Select
								labelId="demo-simple-select-autowidth-label"
								id="demo-simple-select-autowidth"
								onChange={handleGetVote}
								autoWidth
								label="vote"
								name="fruit"
							>
								<MenuItem value="">
									<em>Select Fruit to Vote</em>
								</MenuItem>
								<MenuItem value="Apple">
									Apple <GiShinyApple />
								</MenuItem>
								<MenuItem value="Orange">
									Orange <GiOrangeSlice />
								</MenuItem>
								<MenuItem value="pineApple">
									PineApple <GiPineapple />
								</MenuItem>
								<MenuItem value="strawberry">
									Strawberry <GiStrawberry />
								</MenuItem>
							</Select>
							<Button
								variant="contained"
								size="large"
								disabled={checkResult} // when a fecth result has been initiated the button disables...
								onClick={checkVote}
							>
								{!checkResult ? (
									<div>
										View Result <GrView />
									</div>
								) : (
									<div className="flex gap-2">
										<div className="spinner-container"></div>
										<div className="spinner border-t-4 border-blue-500 border-solid h-4 w-4 rounded-full animate-spin"></div>
										Processing Vote please wait...
									</div>
								)}
							</Button>
						</FormControl>
					</div>
				</div>
			)}

			{/* display this info when wallet is not connected */}
			{!displaypage && (
				<div>
					<h2
						className="subpixel-antialiased"
						style={{ margin: "0 auto", width: "60%" }}
					>
						Connect Wallet to Access Voting System....
					</h2>
				</div>
			)}
		</>
	);
};
export default Main;
