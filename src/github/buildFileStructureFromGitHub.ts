import { IFileStructure } from "@fullstackcraftllc/codevideo-types/dist";
import path from "path";
import os from "os";
import { exec } from "child_process";
import fs from "fs/promises";
import { buildFileStructureFromRootFolder } from "../filesystem/buildFileStructureFromRootFolder";

export const buildFileStructureFromGitHub = async (repoUrl: string): Promise<IFileStructure> => {
    // essentially the same as buildFileStructureFromRootFolder, but first clones the repo to a temp folder
    // and then calls buildFileStructureFromRootFolder
    const tempDir = path.join(os.tmpdir(), 'codevideo', 'github');
    
    // Create temp directory if it doesn't exist
    await fs.mkdir(tempDir, { recursive: true });
    
    try {
        // Get repo name from URL for path construction after cloning
        const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 
                        `repo-${Date.now()}`;
        
        // Clone the repo directly into the temp folder
        await new Promise<void>((resolve, reject) => {
            exec(`git clone ${repoUrl}`, {
                cwd: tempDir
            }, (error, _, __) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
        
        // Build file structure from the cloned repo
        const repoPath = path.join(tempDir, repoName);
        const { fileStructure } = await buildFileStructureFromRootFolder(repoPath);
        return fileStructure;
    } catch (error) {
        throw error;
    }
}