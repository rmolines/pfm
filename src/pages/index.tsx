//@ts-ignore
import Image from "next/image";
import { Inter } from "next/font/google";
import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import { utils, writeFileXLSX } from "xlsx";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
import Link from "next/link";
import { ThreeDots } from "react-loader-spinner";

const inter = Inter({ subsets: ["latin"] });
const id = "22604ad3-549c-40a9-aa27-2b67f776b51c";
const password =
	"uQH**eGKF#l65kmq5V99KawcFdhtqj@QjOQBMJ*hwKWlIfbPQ@163Y94GTbzbikL";

export default function Home() {
	const [link, setLink] = useState("");
	const [loading, setLoading] = useState(false);
	// const [link, setLink] = useState("e313ab3f-8af8-44d0-a3a2-cdcd63416a6b");
	const baseUrl = "https://sandbox.belvo.com";

	const [init, setInit] = useState(false);

	// this should be run only once per application lifetime
	useEffect(() => {
		initParticlesEngine(async (engine) => {
			// you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
			// this loads the tsparticles package bundle, it's the easiest method for getting everything ready
			// starting from v2 you can add only the features you need reducing the bundle size
			//await loadAll(engine);
			//await loadFull(engine);
			await loadSlim(engine);
			//await loadBasic(engine);
		}).then(() => {
			setInit(true);
		});
	}, []);

	const particlesLoaded = (container) => {
		console.log(container);
	};

	const options = useMemo(
		() => ({
			background: {
				color: {
					value: "#000000",
				},
			},
			fpsLimit: 120,
			interactivity: {
				events: {
					// onClick: {
					// 	enable: true,
					// 	mode: "push",
					// },
					onHover: {
						enable: true,
						mode: "repulse",
					},
				},
				modes: {
					push: {
						quantity: 20,
					},
					repulse: {
						distance: 200,
						duration: 2,
					},
				},
			},
			particles: {
				color: {
					value: "#ffffff",
				},
				links: {
					color: "#ffffff",
					distance: 200,
					enable: true,
					opacity: 0.2,
					width: 1,
				},
				move: {
					direction: "none",
					enable: true,
					outModes: {
						default: "bounce",
					},
					random: false,
					speed: 3,
					straight: false,
				},
				number: {
					density: {
						enable: true,
					},
					value: 300,
				},
				opacity: {
					value: 0.2,
				},
				shape: {
					type: "circle",
				},
				size: {
					value: { min: 1, max: 5 },
				},
			},
			detectRetina: true,
		}),
		[]
	);

	// Insert the following code after useScript() function from Step 1.
	async function createWidget() {
		setLoading(true);
		// Function to call your server-side to generate the access_token and retrieve the your access token
		function getAccessToken() {
			// Make sure to change /get-access-token to point to your server-side.
			return fetch("http://localhost:3000/api/belvoToken", {
				method: "GET",
			})
				.then((response) => response.json())
				.then((data) => data)
				.catch((error) => console.error("Error:", error));
		}

		const successCallbackFunction = (link, institution) => {
			setLink(link);
			// Do something with the link and institution,
			// such as associate it with your registered user in your database.
		};
		const onExitCallbackFunction = (data) => {
			// Do something with the exit data.
		};
		const onEventCallbackFunction = (data) => {
			// Do something with the exit data.
		};
		const config = {
			access_mode: "single",
			country_codes: ["BR"],
			// institution_types: ["retail"],
			// resources: ["TRANSACTIONS"],
			locale: "pt",
			callback: (link, institution) =>
				successCallbackFunction(link, institution),
			onExit: (data) => onExitCallbackFunction(),
			onEvent: (data) => onEventCallbackFunction(),
		};
		const { access } = await getAccessToken();
		window.belvoSDK.createWidget(access, config).build();
	}

	useEffect(() => {
		if (link) {
			const fetchAccount = async () => {
				const res = await fetch(`${baseUrl}/api/accounts/`, {
					method: "POST",
					headers: {
						Authorization: `Basic ${Buffer.from(
							id + ":" + password
						).toString("base64")}`,
						accept: "application/json",
						"content-type": "application/json",
					},
					body: JSON.stringify({ link }),
				});
				const data = await res.json();

				console.log(data);
			};

			const fetchRecurringExpenses = async () => {
				console.log("waiting for recurring expenses response...");
				const res = await fetch(`${baseUrl}/api/recurring-expenses/`, {
					method: "POST",
					headers: {
						Authorization: `Basic ${Buffer.from(
							id + ":" + password
						).toString("base64")}`,
						accept: "application/json",
						"content-type": "application/json",
					},
					body: JSON.stringify({
						link: "e313ab3f-8af8-44d0-a3a2-cdcd63416a6b",
						account: "495c3496-c60a-430e-9543-c5c55c6a0d82",
						date_from: "2024-01-01",
						date_to: "2024-12-31",
					}),
				});
				const data = await res.json();

				setExpenses(data);
				console.log("recurring", data);
			};

			const fetchTransactions = async () => {
				console.log("waiting for transactions response...");
				const res = await fetch(`${baseUrl}/api/transactions/`, {
					method: "POST",
					headers: {
						Authorization: `Basic ${Buffer.from(
							id + ":" + password
						).toString("base64")}`,
						accept: "application/json",
						"content-type": "application/json",
					},
					body: JSON.stringify({
						link: "e313ab3f-8af8-44d0-a3a2-cdcd63416a6b",
						account: "495c3496-c60a-430e-9543-c5c55c6a0d82",
						date_from: "2024-06-01",
						date_to: new Date().toISOString().split("T")[0],
					}),
				});
				const data = await res.json();

				console.log(data);

				let clean_trx = [];

				for (const row of data) {
					let temp_json = {
						Conta: row.account.name,
						Descrição: row.description,
						Categoria: row.category,
						Loja: row.merchant?.name,
						Valor: row.amount,
						Data: row.value_date,
						Tipo: row.type,
						Status: row.status,
					};

					clean_trx.push(temp_json);
				}

				const worksheet = utils.json_to_sheet(clean_trx);
				const workbook = utils.book_new();
				utils.book_append_sheet(workbook, worksheet, "finances");
				writeFileXLSX(workbook, "finances.xlsx");
				setLoading(false);
			};

			fetchTransactions();
			// fetchRecurringExpenses();
			// fetchAccount();
		}
	}, [link]);

	return (
		<>
			<Script
				src="https://cdn.belvo.io/belvo-widget-1-stable.js"
				strategy="lazyOnload"
			/>
			{init && (
				<Particles
					id="tsparticles"
					particlesLoaded={particlesLoaded}
					options={options}
				/>
			)}
			<main
				className={`flex min-h-screen flex-col items-center justify-between md:p-24 ${inter.className}`}
			>
				<header className="absolute inset-x-0 top-0 z-50 md:px-16">
					<nav
						className="flex items-center justify-between p-6 lg:px-8"
						aria-label="Global"
					>
						<div className="flex lg:flex-1">
							<Link href="#" className="-m-1.5 p-1.5">
								<span className="sr-only">Your Company</span>
								<Image
									className="h-8 w-auto"
									src="/logo.png"
									alt=""
									width={500}
									height={500}
								/>
							</Link>
						</div>
						<div className="hidden md:flex lg:flex-1 lg:justify-end">
							<button
								onClick={createWidget}
								// href="#"
								className="text-sm font-semibold leading-6 border-indigo-300 border py-2.5 px-3.5 rounded-full"
							>
								Experimentar
							</button>
						</div>
					</nav>
				</header>

				<div className="flex-col relative isolate px-6 lg:px-8 grow content-center">
					<div className="mx-auto max-w-2xl">
						<div className="text-center">
							<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
								Baixe os gastos{" "}
								<span className="font-serif bg-gradient-to-r via-indigo-100 from-indigo-400 to-indigo-500 inline-block text-transparent bg-clip-text">
									categorizados
								</span>{" "}
								de todos seus cartões
							</h1>
							<p className="mt-6 text-lg leading-8 text-gray-600">
								Com o compartilhamento de dados do Open Finance
								geramos planilhas automáticas com todos os seus
								gastos organizados por categoria
							</p>
							<div className="mt-10 flex items-center justify-center gap-x-6">
								<button
									onClick={createWidget}
									className="rounded-full bg-gradient-to-r via-indigo-600 from-indigo-500 to-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								>
									{!loading && "Experimentar"}
									<ThreeDots
										visible={loading}
										height="25"
										width="25"
										color="#ffffff"
										radius="10"
										ariaLabel="three-dots-loading"
										wrapperStyle={{}}
										wrapperClass=""
									/>
								</button>
								<Link
									target="_blank"
									href="https://www.instagram.com/guarda_mais/"
									className="text-sm font-semibold leading-6"
								>
									Saiba mais <span aria-hidden="true">→</span>
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div id="belvo" />
			</main>
		</>
	);
}
