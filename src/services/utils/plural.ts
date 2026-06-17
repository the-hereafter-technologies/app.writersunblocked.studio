export const pluralize = (singular: string, count: number) => {
  if (count === 1) {
    return singular;
  }
  return `${singular}s`;
};
