import mock from 'mock-fs';
import { buildFileStructureFromGitHub } from '../src/github/buildFileStructureFromGitHub';
import * as child_process from 'child_process';
import path from 'path';
import os from 'os';

jest.mock('child_process');

describe("buildFileStructureFromGitHub", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    afterEach(() => {
        mock.restore();
    });

    it("should clone repo and build structure", async () => {
        // Mock filesystem
        const tempDir = path.join(os.tmpdir(), 'codevideo', 'github');
        const repoPath = path.join(tempDir, 'test-repo');
        
        mock({
            [tempDir]: {},
            [repoPath]: {
                'package.json': '{"name": "test-repo"}',
                'src': {
                    'main.js': 'console.log("main");'
                }
            }
        });

        // Mock the exec function to simulate successful clone
        const execMock = jest.spyOn(child_process, 'exec');
        // @ts-ignore - we're mocking the callback
        execMock.mockImplementation((cmd, options, callback) => {
            // Simulate successful git clone
            if (callback) {
                callback(null, '', '');
            }
            return {} as child_process.ChildProcess;
        });

        const result = await buildFileStructureFromGitHub('https://github.com/user/test-repo.git');

        expect(execMock).toHaveBeenCalled();
        expect(result['package.json'].content).toBe('{"name": "test-repo"}');
        expect(result.src.type).toBe('directory');
        expect(result.src.children?.['main.js'].content).toBe('console.log("main");');
    });

    it("should handle git clone errors", async () => {
        // Mock filesystem
        const tempDir = path.join(os.tmpdir(), 'codevideo', 'github');
        mock({
            [tempDir]: {}
        });

        // Mock exec to simulate git clone failure
        const execMock = jest.spyOn(child_process, 'exec');
        // @ts-ignore - we're mocking the callback
        execMock.mockImplementation((cmd, options, callback) => {
            const error = new Error('Git clone failed');
            if (callback) {
                callback(error, '', 'Error: Repository not found');
            }
            return {} as child_process.ChildProcess;
        });

        await expect(buildFileStructureFromGitHub('https://github.com/invalid/repo.git'))
            .rejects.toThrow();
    });

    it("should extract repo name from different URL formats", async () => {
        // Mock filesystem and buildFileStructureFromRootFolder
        const tempDir = path.join(os.tmpdir(), 'codevideo', 'github');
        const repoName = 'custom-repo';
        const repoPath = path.join(tempDir, repoName);
        
        mock({
            [tempDir]: {},
            [repoPath]: {
                'README.md': 'Test content'
            }
        });

        // Mock exec to capture the URL parsing
        const execMock = jest.spyOn(child_process, 'exec');
        // @ts-ignore - we're mocking the callback
        execMock.mockImplementation((cmd, options, callback) => {
            if (callback) {
                // Simulate successful git clone
                callback(null, '', '');
            }
            return {} as child_process.ChildProcess;
        });

        await buildFileStructureFromGitHub('https://github.com/user/custom-repo');
        
        expect(execMock).toHaveBeenCalledWith(
            expect.stringContaining('git clone https://github.com/user/custom-repo'),
            expect.any(Object),
            expect.any(Function)
        );
    });
});
