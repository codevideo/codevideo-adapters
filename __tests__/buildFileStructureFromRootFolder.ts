import mock from 'mock-fs';
import { buildFileStructureFromRootFolder } from '../src/filesystem/buildFileStructureFromRootFolder';

describe("buildFileStructureFromRootFolder", () => {
    afterEach(() => {
        mock.restore();
    });

    it("should handle basic file and folder structure", async () => {
        mock({
            '/project': {
                'README.md': '# Project Title',
                'src': {
                    'index.ts': 'console.log("Hello");',
                    'utils': {
                        'helper.js': 'export const add = (a, b) => a + b;'
                    }
                }
            }
        });

        const result = await buildFileStructureFromRootFolder('/project');

        expect(result['README.md']).toEqual({
            type: 'file',
            content: '# Project Title',
            language: "Markdown",
            caretPosition: { row: 0, col: 0 }
        });
        
        expect(result.src.type).toBe('directory');
        expect((result.src as any).children?.['index.ts']).toEqual({
            type: 'file',
            content: 'console.log("Hello");',
            language: "TypeScript",
            caretPosition: { row: 0, col: 0 }
        });
    });

    it("should handle deeply nested directories", async () => {
        mock({
            '/deep-structure': {
                'level1': {
                    'level2': {
                        'level3': {
                            'file.txt': 'deep content'
                        }
                    }
                }
            }
        });

        const result = await buildFileStructureFromRootFolder('/deep-structure');

        expect(result.level1.type).toBe('directory');
        expect((result.level1 as any).children?.level2.type).toBe('directory');
        expect((result.level1 as any).children?.level2.children?.level3.type).toBe('directory');
        expect((result.level1 as any).children?.level2.children?.level3.children?.['file.txt'].content)
            .toBe('deep content');
    });

    it("should handle errors gracefully", async () => {
        mock({
            '/broken-project': {
                'regular.txt': 'normal content'
            }
        });

        await expect(buildFileStructureFromRootFolder('/non-existent'))
            .rejects.toThrow(/Error accessing directory/);
    });
});
