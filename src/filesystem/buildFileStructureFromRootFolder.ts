import { IFileStructure } from "@fullstackcraftllc/codevideo-types";
import fs from 'fs/promises';
import path from 'path';
import { getLanguageFromExtension } from '../utils/getLanguageFromExtension';

/**
 * Given a root folder, this adapter builds a file stucture formatted for the CodeVideo ecosystem
 * in the form of IFileStructure - a recursive tree-like folder and file structure.
 * @param rootFolder The root folder to build the file structure from
 */
export const buildFileStructureFromRootFolder = async (rootFolder: string): Promise<IFileStructure> => {
  const result: IFileStructure = {};
  
  // Check if the folder exists
  try {
    const stats = await fs.stat(rootFolder);
    if (!stats.isDirectory()) {
      throw new Error(`${rootFolder} is not a directory`);
    }
  } catch (error: any) {
    throw new Error(`Error accessing directory ${rootFolder}: ${error.message}`);
  }
  
  // Read contents of the directory
  const entries = await fs.readdir(rootFolder);
  
  // Process each entry
  for (const entry of entries) {
    const fullPath = path.join(rootFolder, entry);
    const stats = await fs.stat(fullPath);
    
    if (stats.isFile()) {
      // Handle file
      const extension = path.extname(entry).slice(1); // Remove the dot
      const language = getLanguageFromExtension(extension);
      let content = '';
      
      try {
        content = await fs.readFile(fullPath, 'utf-8');
      } catch (error: any) {
        console.warn(`Could not read file ${fullPath}: ${error.message}`);
      }
      
      result[entry] = {
        type: 'file',
        content,
        language: language || "plaintext",
        caretPosition: { row: 0, col: 0 }
      };
    } else if (stats.isDirectory()) {
      // Handle directory
      const subDirectoryStructure = await buildFileStructureFromRootFolder(fullPath);
      
      result[entry] = {
        type: 'directory',
        content: '', // Directories don't have content
        collapsed: false,
        children: subDirectoryStructure
      };
    }
  }
  
  return result;
};