import { keepPreviousData } from "@tanstack/react-query";
import { api } from "~/trpc/react";

export const useGetAllMedia = (organizationSlug: string | undefined) => {
	const query = api.media.getAll.useQuery(
		{ organizationSlug: organizationSlug ?? "" },
		{
			enabled: !!organizationSlug,
			placeholderData: keepPreviousData,
		},
	);
	return query;
};
