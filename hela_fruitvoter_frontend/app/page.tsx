"use client";
import Image from "next/image";
import { NotificationProvider } from "@web3uikit/core";
// const { NotificationProvider } = require("@web3uikit/core");
import Nav from "./components/nav";
import Main from "./components/Main";
export default function Home() {
	return (
		<>
			<NotificationProvider>
				<Nav />
				<Main />
			</NotificationProvider>
		</>
	);
}
