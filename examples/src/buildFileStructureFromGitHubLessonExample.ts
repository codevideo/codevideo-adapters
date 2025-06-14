import fs from 'fs'
import { ILesson } from "@fullstackcraftllc/codevideo-types"
import { buildFileStructureFromGitHub } from "@fullstackcraftllc/codevideo-adapters";
import path from 'path';
import * as bigJSON from 'big-json';

const buildFileStructureFromGitHubLessonExample = async () => {
    // CHANGE THIS LINE TO WHATEVER GITHUB REPOSITORY YOU WANT TO USE
    const repoUrl = "https://github.com/expressjs/express.git"

    // generate file structure from the passed in folder
    const fileStructure = await buildFileStructureFromGitHub(repoUrl)

    const lesson: ILesson = {
        id: 'express-js-exploration',
        name: 'Express.js Exploration',
        description: 'Learn about the Express.js codebase and how it works!',
        initialSnapshot: {
            isUnsavedChangesDialogOpen: false,
            unsavedFileName: '',
            fileExplorerSnapshot: {
                isFileExplorerContextMenuOpen: false,
                isFileContextMenuOpen: false,
                isFolderContextMenuOpen: false,
                isNewFileInputVisible: false,
                isNewFolderInputVisible: false,
                isRenameFileInputVisible: false,
                isRenameFolderInputVisible: false,
                newFileInputValue: '',
                newFolderInputValue: '',
                renameFileInputValue: '',
                renameFolderInputValue: '',
                originalFileBeingRenamed: '',
                originalFolderBeingRenamed: '',
                newFileParentPath: '',
                newFolderParentPath: '',
                fileStructure,
            },
            editorSnapshot: {
                isEditorContextMenuOpen: false,
                editors: []
            },
            terminalSnapshot: {
                terminals: []
            },
            mouseSnapshot: {
                location: 'editor',
                currentHoveredFileName: '',
                currentHoveredFolderName: '',
                currentHoveredEditorTabFileName: '',
                x: 0,
                y: 0,
                timestamp: 0,
                type: 'move',
                buttonStates: {
                    left: false,
                    right: false,
                    middle: false,
                },
                scrollPosition: {
                    x: 0,
                    y: 0
                },
            },
            authorSnapshot: {
                authors: []
            }
        },
        actions: []


    };

    // remove any course.json file if it exists
    const courseFilePath = path.join(process.cwd(), 'express-lesson.json');
    if (fs.existsSync(courseFilePath)) {
        fs.unlinkSync(courseFilePath);
    }

    // Use big-json for large objects
    const stringifyStream = bigJSON.createStringifyStream({
        body: lesson
    });

    stringifyStream.pipe(fs.createWriteStream(courseFilePath));
}

buildFileStructureFromGitHubLessonExample();