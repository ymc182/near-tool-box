// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { viewMethod } from "../../../../helper/near";

type Data = {
	success: boolean;
	data?: any;
};
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { contractId, ownerId } = req.query;

	const nfts = await viewMethod(contractId as string, "nft_tokens_for_owner", {
		account_id: ownerId,
	}).catch((err: any) => {
		res.status(500).json({ success: false, data: err.message });
	});
	console.log(nfts);
	res.status(200).json({ success: true, data: nfts });
}
