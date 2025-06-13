import { buildFileStructureFromGitHub } from '../src/github/buildFileStructureFromGitHub';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';

describe("buildFileStructureFromGitHub - Integration Tests", () => {
    // Cleanup function to remove temp directories
    const cleanupTempDir = async () => {
        const tempDir = path.join(os.tmpdir(), 'codevideo', 'github');
        try {
            await fs.rm(tempDir, { recursive: true, force: true });
        } catch (error) {
            // Ignore cleanup errors
        }
    };

    beforeEach(async () => {
        await cleanupTempDir();
    });

    afterEach(async () => {
        await cleanupTempDir();
    });

    it("should clone Express.js repository and verify basic structure", async () => {
        const repoUrl = 'https://github.com/expressjs/express';
        
        // This is a real integration test - it actually clones the repo
        // Set a longer timeout since cloning can take time
        const result = await buildFileStructureFromGitHub(repoUrl);

        // Verify that we have a valid file structure
        expect(result).toBeDefined();
        expect(typeof result).toBe('object');

        console.log("Cloned repository structure:", result);

        // Check for README file (should exist in Express repo)
        // funily enough they use a lowercase Readme.md
        expect(result['Readme.md']).toBeDefined();
        expect(result['Readme.md'].type).toBe('file');
        expect(result['Readme.md'].language).toBe('Markdown');
        expect(result['Readme.md'].content).toContain('Express');

        // Check for LICENSE file
        expect(result['LICENSE']).toBeDefined();
        expect(result['LICENSE'].type).toBe('file');
        expect(result['LICENSE'].content).toContain('MIT License');

        // Check for package.json
        expect(result['package.json']).toBeDefined();
        expect(result['package.json'].type).toBe('file');
        expect(result['package.json'].language).toBe('JSON');
        
        // Parse and verify package.json content
        const packageJsonContent = JSON.parse(result['package.json'].content);
        expect(packageJsonContent.name).toBe('express');
        expect(packageJsonContent.description).toContain('web framework');

        // Check for lib directory (main Express source)
        expect(result['lib']).toBeDefined();
        expect(result['lib'].type).toBe('directory');
        expect(result['lib'].children).toBeDefined();

        // Check for index.js (main entry point)
        expect(result['index.js']).toBeDefined();
        expect(result['index.js'].type).toBe('file');
        expect(result['index.js'].language).toBe('JavaScript');

        // Verify we have some JavaScript files
        const hasJSFiles = checkForFileTypes(result, ['.js']);
        expect(hasJSFiles).toBe(true);

        // Verify we filtered out node_modules and .git
        expect(result['node_modules']).toBeUndefined();
        expect(result['.git']).toBeUndefined();
    }, 30000); // 30 second timeout for cloning

    it("should handle invalid repository URL gracefully", async () => {
        const invalidRepoUrl = 'https://github.com/nonexistent/invalid-repo-name-12345';
        
        await expect(buildFileStructureFromGitHub(invalidRepoUrl))
            .rejects.toThrow();
    }, 30000); // 30 second timeout

    // Helper function to recursively check for file types
    function checkForFileTypes(structure: any, extensions: string[]): boolean {
        for (const key in structure) {
            const item = structure[key];
            
            if (item.type === 'file') {
                const hasMatchingExtension = extensions.some(ext => key.endsWith(ext));
                if (hasMatchingExtension) {
                    return true;
                }
            } else if (item.type === 'directory' && item.children) {
                if (checkForFileTypes(item.children, extensions)) {
                    return true;
                }
            }
        }
        return false;
    }
});
