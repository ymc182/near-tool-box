// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { viewMethod } from "../../../helper/near";

type Data = {
	success: boolean;
	data?: any;
};
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { contractId } = req.query;
	let allNfts: any = [];

	const totalSupply = await viewMethod(
		contractId as string,
		"nft_total_supply",
		{}
	).catch((err: any) => {
		res.status(500).json({ success: false, data: err.message });
	});

	const maxAmount = parseInt(totalSupply);

	let promises: any = [];
	console.log(maxAmount);
	for (let i = 0; i <= maxAmount; i++) {
		const nfts_promise = new Promise(async (resolve, rej) => {
			const nft = await viewMethod(contractId as string, "nft_token", {
				token_id: i.toString(),
			}).catch((err: any) => {});

			if (nft) resolve({ token_id: nft.token_id, owner_id: nft.owner_id });
			else resolve(null);
		});

		promises.push(nfts_promise);
	}

	const results = await Promise.all(promises);
	for (const result of results) {
		if (result !== null) allNfts.push(result);
	}

	res.status(200).json({ success: true, data: allNfts });
}
