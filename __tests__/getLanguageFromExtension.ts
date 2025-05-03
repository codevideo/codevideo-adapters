import { getLanguageFromExtension } from '../src/utils/getLanguageFromExtension';

describe('getLanguageFromExtension', () => {
  it('should detect common web extensions correctly', () => {
    expect(getLanguageFromExtension('html')).toBe('HTML');
    expect(getLanguageFromExtension('css')).toBe('CSS');
    expect(getLanguageFromExtension('scss')).toBe('Sass');
    expect(getLanguageFromExtension('less')).toBe('Less');
  });

  it('should handle JavaScript and TypeScript family extensions', () => {
    expect(getLanguageFromExtension('js')).toBe('JavaScript');
    expect(getLanguageFromExtension('mjs')).toBe('JavaScript (ES Module)');
    expect(getLanguageFromExtension('ts')).toBe('TypeScript');
    expect(getLanguageFromExtension('tsx')).toBe('TypeScript React');
    expect(getLanguageFromExtension('jsx')).toBe('JavaScript React');
  });

  it('should handle extensions with and without leading dots', () => {
    expect(getLanguageFromExtension('py')).toBe('Python');
    expect(getLanguageFromExtension('.py')).toBe('Python');
    expect(getLanguageFromExtension('md')).toBe('Markdown');
    expect(getLanguageFromExtension('.md')).toBe('Markdown');
  });

  it('should be case insensitive when matching extensions', () => {
    expect(getLanguageFromExtension('MD')).toBe('Markdown');
    expect(getLanguageFromExtension('Ts')).toBe('TypeScript');
    expect(getLanguageFromExtension('JSON')).toBe('JSON');
    expect(getLanguageFromExtension('YML')).toBe('YAML');
  });

  it('should return null for unknown extensions', () => {
    expect(getLanguageFromExtension('unknown')).toBeNull();
    expect(getLanguageFromExtension('123')).toBeNull();
    expect(getLanguageFromExtension('')).toBeNull();
  });
});
