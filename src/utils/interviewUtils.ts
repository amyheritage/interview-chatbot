export function formatScore(score: number): string {
  if (score < 0) return '0/5';
  if (score > 5) return '5/5';
  return `${Math.round(score)}/5`;
}

export function validateInput(input: string): boolean {
  return input.trim().length >= 10;
}
