import { z } from "zod";
import { viewMethod } from "../../helper/near";
import { procedure, router } from "../trpc";
import { nftRouter, nftsForOwnerRouter, nftsRouter } from "./nft";
export const appRouter = router({
	hello: procedure
		.input(
			z.object({
				text: z.string(),
			})
		)
		.query(({ input }) => {
			return {
				greeting: `hello ${input.text}`,
			};
		}),

	nft: nftRouter,
	nfts: nftsRouter,
	nftsForOwner: nftsForOwnerRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
