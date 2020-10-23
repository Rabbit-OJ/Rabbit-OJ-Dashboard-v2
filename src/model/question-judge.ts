export type QuestionJudgeCompareType = "STDIN_F" | "STDIN_S" | "CMP";

export interface QuestionJudge {
    mode: QuestionJudgeCompareType;
    dataset_count: number;
    version: number;
}
