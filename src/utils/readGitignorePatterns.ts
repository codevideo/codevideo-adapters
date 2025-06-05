import fs from 'fs/promises';
import path from 'path';

/**
 * Function to read and parse .gitignore file
 * @param directory The directory to look for .gitignore file in
 * @returns Array of gitignore patterns (excluding comments and empty lines)
 */
export const readGitignorePatterns = async (directory: string): Promise<string[]> => {
  const gitignorePath = path.join(directory, '.gitignore');
  
  try {
    const content = await fs.readFile(gitignorePath, 'utf-8');
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
  } catch (error) {
    // .gitignore doesn't exist or can't be read
    return [];
  }
};
