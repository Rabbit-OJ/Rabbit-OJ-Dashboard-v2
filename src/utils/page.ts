export const PAGE_SIZE = 20;

export const calculatePageCount = (count: number): number => {
  return Math.ceil(count / PAGE_SIZE) | 0;
};
