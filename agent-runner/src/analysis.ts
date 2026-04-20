export function analyzeDiffMock(pr: any) {
  return [
    {
      file: 'src/example.ts',
      line: 1,
      message: 'Mock rule violation: avoid `any` in public APIs',
      severity: 'high'
    }
  ];
}
