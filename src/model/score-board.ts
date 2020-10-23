import { GeneralListResponse } from './question-list';

export interface ScoreBoard {
    uid: number;
    username: string;
    score: number;
    total_time: number;
    rank: number;
    progress: Array<ScoreBoardProgress>;
}

export interface ScoreBoardProgress {
    status: 0 | -1| 1;
    bug: number;
    total_time: number;
}

export interface ScoreBoardResponse extends GeneralListResponse<ScoreBoard> {
    blocked: boolean;
}