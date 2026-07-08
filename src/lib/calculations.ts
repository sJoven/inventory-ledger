export function calculatePercentageChange(
  currentValue: number,
  previousValue: number,
) {
  let percentageChange = 0;

  if (previousValue > 0) {
    percentageChange = ((currentValue - previousValue) / previousValue) * 100;
  }

  return {
    percentageChange: Number(percentageChange.toFixed(2)),
    isPositive: percentageChange >= 0,
  };
}
