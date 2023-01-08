//create a trpc router for fetch nft

import { Lekton } from "@next/font/google";
import { TRPCError } from "@trpc/server";
import { resolve } from "path";
import { z } from "zod";
import { viewMethod } from "../../helper/near";
import { procedure } from "../trpc";

//create a trpc router for fetch nft
export const nftRouter = procedure

	//define input type
	.input(
		z.object({
			contractId: z.string(),
			tokenId: z.string(),
		})
	)
	.query(async ({ input }) => {
		console.log(input);
		//fetch nft
		const nfts = await viewMethod(input.contractId, "nft_token", {
			token_id: input.tokenId,
		}).catch((err: any) => {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: err.message,
			});
		});
		return nfts;
	});

export const nftsRouter = procedure

	//define input type
	.input(
		z.object({
			contractId: z.string(),
		})
	)
	.query(async ({ input }) => {
		//fetch nft

		let allNfts: any = [];

		const totalSupply = await viewMethod(
			input.contractId,
			"nft_total_supply",
			{}
		).catch((err: any) => {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Contract Total Supply Not Supported",
			});
		});

		const maxAmount = parseInt(totalSupply);

		let promises: any = [];
		console.log(maxAmount);
		for (let i = 0; i <= maxAmount; i++) {
			const nfts_promise = new Promise(async (resolve, rej) => {
				const nft = await viewMethod(input.contractId, "nft_token", {
					token_id: i.toString(),
				}).catch((err: any) => {});

				if (nft) resolve(nft.owner_id);
				else resolve(null);
			});

			promises.push(nfts_promise);
		}

		const results = await Promise.all(promises);
		for (const result of results) {
			if (result !== null) allNfts.push(result);
		}
		console.log(allNfts);
		return allNfts;
	});

export const nftsForOwnerRouter = procedure

	//define input type
	.input(
		z.object({
			contractId: z.string(),
			ownerId: z.string(),
			fromIndex: z.string().nullable(),
			limit: z.number().nullable(),
		})
	)
	.query(async ({ input }) => {
		//fetch nft
		const nfts = await viewMethod(input.contractId, "nft_tokens_for_owner", {
			account_id: input.ownerId,
			from_index: input.fromIndex,
			limit: input.limit,
		}).catch((err: any) => {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: err.message,
			});
		});

		let allNfts: any = [];

		for (const nft of nfts) {
			allNfts.push(nft.token_id);
		}

		return allNfts;
	});
