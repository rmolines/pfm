import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const tokenData = {
		id: "22604ad3-549c-40a9-aa27-2b67f776b51c",
		password:
			"uQH**eGKF#l65kmq5V99KawcFdhtqj@QjOQBMJ*hwKWlIfbPQ@163Y94GTbzbikL",
		scopes: "read_institutions,write_links,read_consents,write_consents,write_consent_callback,delete_consents",
		credentials_storage: "365d",
		stale_in: "300d",
		fetch_resources: ["ACCOUNTS", "TRANSACTIONS", "OWNERS"],
		widget: {
			openfinance_feature: "consent_link_creation",
			callback_urls: {
				success: "your_deeplink_here://success",
				exit: "your_deeplink_here://exit",
				event: "your_deeplink_here://error",
			},
			consent: {
				terms_and_conditions_url:
					"https://www.termsfeed.com/blog/sample-terms-and-conditions-template/",
				permissions: [
					"REGISTER",
					"ACCOUNTS",
					"CREDIT_CARDS",
					"CREDIT_OPERATIONS",
				],
				identification_info: [
					{
						type: "CPF",
						number: "76109277673",
						name: "Ralph Bragg",
					},
				],
			},
		},
	};

	const response = await fetch("https://sandbox.belvo.com/api/token/", {
		method: "POST",
		headers: {
			Host: "sandbox.belvo.com",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(tokenData),
	});

	const data = await response.json();

	console.log(data);

	res.status(200).json(data);
}
