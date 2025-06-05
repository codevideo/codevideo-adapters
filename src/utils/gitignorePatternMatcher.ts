import path from 'path';

/**
 * Simple gitignore pattern matching function
 * @param filePath The file path to check (relative path)
 * @param patterns Array of gitignore patterns
 * @returns true if the file path matches any of the patterns
 */
export const matchesGitignorePattern = (filePath: string, patterns: string[]): boolean => {
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  return patterns.some(pattern => {
    if (!pattern.trim() || pattern.startsWith('#')) return false;
    
    // Handle negation patterns (starting with !)
    const isNegation = pattern.startsWith('!');
    const cleanPattern = isNegation ? pattern.slice(1) : pattern;
    
    // Convert gitignore pattern to regex
    let regexPattern = cleanPattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    
    // Handle directory patterns (ending with /)
    if (cleanPattern.endsWith('/')) {
      regexPattern = regexPattern.slice(0, -1) + '(/.*)?$';
    } else {
      regexPattern = `^${regexPattern}$|/${regexPattern}$|^${regexPattern}/|/${regexPattern}/`;
    }
    
    const regex = new RegExp(regexPattern);
    const matches = regex.test(normalizedPath) || regex.test(path.basename(normalizedPath));
    
    return isNegation ? !matches : matches;
  });
};
