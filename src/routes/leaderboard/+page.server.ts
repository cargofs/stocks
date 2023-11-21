import { api } from '$lib/server/api';
import type { PageServerLoad } from './$types';
import { genericServerError } from '$lib';

export const load = (async ({ fetch, depends }) => {
    depends("app:leaderboard");

    const response: Data.APINormalResponse<Data.LeaderboardResponse> = await api(fetch, "GET", "statistics/leaderboard", null, null, null);

    if (response.data?.userScoreList) {
        return {
            userScoreFlatList: response.data.userScoreList.map(userScore => {
                return { login: userScore.login, ...userScore.changeCost } satisfies Data.UserScoreFlat;
            })
        }
    } else {
        throw genericServerError(response.statusCode);
    }
}) satisfies PageServerLoad;
