import { api } from '$lib/server/api';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
    const response: Data.APINormalResponse<Data.LeaderboardResponse> = await api(fetch, "GET", "statistics/leaderboard", null, null, null);

    if (response.data?.userScoreList) {
        return {
            userScoreFlatList: response.data.userScoreList.map(userScore => {
                return { login: userScore.login, ...userScore.changeCost } satisfies Data.UserScoreFlat;
            })
        }
    } else {
        return fail(500);
    }
}) satisfies PageServerLoad;
