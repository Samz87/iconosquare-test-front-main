export function createRandomEvent(index: number) {
  return {
    index,
    value1: Math.round(Math.random() * 10000),
    value2: Math.round(Math.random() * 10000),
    comment: `Random comment ${index}`,
  };
}
