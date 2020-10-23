export interface Contest<T = Date> {
    cid: number;
    name: string;
    uid: number;
    start_time: T;
    block_time: T;
    end_time: T;
    status: 0 | 1 | 2 | 3;
    participants: number;
    penalty: number;
    count: number;
}