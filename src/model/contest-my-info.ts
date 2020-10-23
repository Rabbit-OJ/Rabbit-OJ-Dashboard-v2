import { ScoreBoardProgress } from './score-board';

export interface ContestMyInfo {
    score: number;
    rank: number;
    total_time: number;
    progress: Array<ScoreBoardProgress>;
    registered: boolean;
}
