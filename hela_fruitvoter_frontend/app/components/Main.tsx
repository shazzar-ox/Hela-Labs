"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useBalance, useNetwork } from "wagmi";
import { useSignMessage } from "wagmi";
import { useNotification, NotificationProvider } from "@web3uikit/core";
// const { useNotification, NotificationProvider } = require("@web3uikit/core");
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
	const dispatch = useNotification();
	const handleNewNotification = (msg: string, type: string) => {
		dispatch({
			type: type,
			message: msg,
			title: "New Notification",
			position: "topR",
			icon: <BsFillBellFill />,
		});
	};
	const {
		data,
		isError: signedError,
		isSuccess: signedSuccess,
		signMessage,
	} = useSignMessage({
		message: `Hello fren you are about to vote for ${voteFruit.fruit} Click sign in to Vote`,
	});

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

	useEffect(() => {
		if (signedSuccess) {
			const submitVote = async () => {
				try {
					const response = await axios.post(
						"https://server-6f0h.onrender.com/api/v1/fruits/vote",
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

	// handle select option to cast avote
	const handleVote = (event: any) => {
		const { name, value } = event.target;
		console.log(value);
		setVoteFruit((prev) => {
			return { ...prev, [name]: value.toLowerCase() };
		});
	};

	// handle select option to cast avote
	const handleGetVote = (event: any) => {
		const { name, value } = event.target;
		setGetFruit((prev) => {
			return { ...prev, [name]: value.trim().toLowerCase() };
		});
	};

	// function to vote
	const handleSumbitVote = async (event: any) => {
		console.log(voteFruit.fruit);
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
			setCheckResult(true);
			try {
				const response = await axios.post(
					"https://server-6f0h.onrender.com/api/v1/fruits/getvote",
					getFruit
				);
				const info = `What do we have here!!!! ${response.data.data.data} has ${response.data.data.vote} votes`;
				handleNewNotification(info, "success");
				console.log(response.data.data.data);
				setCheckResult(false);
			} catch (err: any) {
				console.log(err);
				setCheckResult(false);

				handleNewNotification(err.message, "error");
			}
		}
	};

	return (
		<>
			{displaypage && (
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
							>
								{!processVote ? (
									<div>
										Vote <GiVote />
									</div>
								) : (
									<div>
										<svg
											className="animate-spin h-5 w-5 mr-3 ..."
											viewBox="0 0 64 64"
										>
											...
										</svg>
										Voting....
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
								disabled={checkResult}
								onClick={checkVote}
							>
								{!checkResult ? (
									<div>
										View Result <GrView />
									</div>
								) : (
									<div>
										<svg
											className="animate-spin h-5 w-5 mr-3 ..."
											viewBox="0 0 64 64"
										>
											...
										</svg>
										Processing Vote Result...
									</div>
								)}
							</Button>
						</FormControl>
					</div>
				</div>
			)}

			{/* display this inof when wallet is not connected */}
			{!displaypage && (
				<div>
					<h2
						className="subpixel-antialiased"
						style={{ margin: "0 auto", width: "60%" }}
					>
						Connect Wallet to Access Vote platform....
					</h2>
				</div>
			)}
		</>
	);
};
export default Main;
