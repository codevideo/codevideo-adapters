import { IFileStructure } from "@fullstackcraftllc/codevideo-types";
import fs from 'fs/promises';
import path from 'path';
import { getLanguageFromExtension } from '../utils/getLanguageFromExtension';
import { matchesGitignorePattern } from '../utils/gitignorePatternMatcher';
import { readGitignorePatterns } from '../utils/readGitignorePatterns';

// Define binary file extensions
const BINARY_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'ico',
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'zip', 'rar', '7z', 'tar', 'gz', 'bz2',
  'exe', 'dll', 'so', 'dylib',
  'mp3', 'mp4', 'avi', 'mov', 'wmv', 'flv',
  'ttf', 'otf', 'woff', 'woff2', 'eot',
  'bin', 'dat', 'db', 'sqlite', 'sqlite3'
]);

// Function to determine if a file is likely binary
const isBinaryFile = (extension: string): boolean => {
  return BINARY_EXTENSIONS.has(extension.toLowerCase());
};

// Function to detect if content contains binary data
const containsBinaryData = (buffer: Buffer): boolean => {
  // Check for null bytes or high ratio of non-printable characters
  const nullBytes = buffer.filter(byte => byte === 0).length;
  if (nullBytes > 0) return true;
  
  const nonPrintable = buffer.filter(byte => 
    byte < 32 && byte !== 9 && byte !== 10 && byte !== 13
  ).length;
  
  return (nonPrintable / buffer.length) > 0.1; // More than 10% non-printable
};

/**
 * Given a root folder, this adapter builds a file stucture formatted for the CodeVideo ecosystem
 * in the form of IFileStructure - a recursive tree-like folder and file structure.
 * @param rootFolder The root folder to build the file structure from
 * @param relativePath The relative path from the original root (for pattern matching)
 */
export const buildFileStructureFromRootFolder = async (
  rootFolder: string,
  relativePath: string = '',
  inheritedPatterns: string[] = []
): Promise<{
  fileStructure: IFileStructure;
  includedFiles: string[];
}> => {
  const fileStructure: IFileStructure = {};
  let includedFiles: string[] = [];

  // Check if the folder exists
  try {
    const stats = await fs.stat(rootFolder);
    if (!stats.isDirectory()) {
      throw new Error(`${rootFolder} is not a directory`);
    }
  } catch (error: any) {
    throw new Error(`Error accessing directory ${rootFolder}: ${error.message}`);
  }

  // Read .gitignore file
  const gitignorePath = path.join(rootFolder, '.gitignore');
  let currentPatterns = [...inheritedPatterns];
  try {
    const localPatterns = await readGitignorePatterns(gitignorePath);
    currentPatterns.push(...localPatterns);
  } catch (error: any) {
    console.warn(`Could not read .gitignore file at ${gitignorePath}: ${error.message}`);
  }

  // Read contents of the directory
  const entries = await fs.readdir(rootFolder);

  // Process each entry
  for (const entry of entries) {
    const fullPath = path.join(rootFolder, entry);
    const entryRelativePath = relativePath ? `${relativePath}/${entry}` : entry;

    // Skip if matches gitignore patterns
    if (matchesGitignorePattern(entryRelativePath, currentPatterns)) {
      continue;
    }

    // Secondary checks
    if (fullPath.includes("node_modules") || fullPath.includes(".git")) {
      continue;
    }

    const stats = await fs.stat(fullPath);

    if (stats.isFile()) {
      // Handle file
      const extension = path.extname(entry).slice(1);
      const language = getLanguageFromExtension(extension);
      let content = '';
      let isBinary = false;

      try {
        // First, determine if this is likely a binary file
        const isKnownBinary = isBinaryFile(extension);
        
        if (isKnownBinary) {
          // Handle known binary files
          const buffer = await fs.readFile(fullPath);
          content = buffer.toString('base64');
          isBinary = true;
        } else {
          // For unknown extensions, read a small chunk to detect binary content
          const buffer = await fs.readFile(fullPath);
          
          if (containsBinaryData(buffer)) {
            // Detected as binary, convert to base64
            content = buffer.toString('base64');
            isBinary = true;
          } else {
            // Treat as text
            content = buffer.toString('utf-8');
          }
        }
        
        includedFiles.push(fullPath);
      } catch (error: any) {
        console.warn(`Could not read file ${fullPath}: ${error.message}`);
        continue;
      }

      fileStructure[entry] = {
        type: 'file',
        content,
        language: isBinary ? 'binary' : (language || "plaintext"),
        caretPosition: { row: 0, col: 0 },
        ...(isBinary && { mimeType: getMimeType(extension) }) // Add MIME type for binary files
      };
    } else if (stats.isDirectory()) {
      // Handle directory
      const subDirectoryResult = await buildFileStructureFromRootFolder(
        fullPath,
        entryRelativePath,
        currentPatterns
      );

      fileStructure[entry] = {
        type: 'directory',
        content: '',
        collapsed: false,
        children: subDirectoryResult.fileStructure
      };
      includedFiles = includedFiles.concat(subDirectoryResult.includedFiles);
    }
  }

  return { fileStructure, includedFiles };
};

// Helper function to get MIME type based on extension
const getMimeType = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'pdf': 'application/pdf',
    'zip': 'application/zip',
    'mp3': 'audio/mpeg',
    'mp4': 'video/mp4',
    'ttf': 'font/ttf',
    'woff': 'font/woff',
    'woff2': 'font/woff2'
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
};