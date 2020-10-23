import { SubmissionLite } from './submission';

export interface SubmissionResponse {
    list: Array<SubmissionLite>;
    count: number;
}
