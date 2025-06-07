import fs from 'fs'
import { ILesson } from "@fullstackcraftllc/codevideo-types"
import { buildFileStructureFromRootFolder } from "@fullstackcraftllc/codevideo-adapters";
import path from 'path';
import * as bigJSON from 'big-json';

const buildFileStructureFromRootFolderLessonExample = async () => {
    // CHANGE THIS LINE TO WHATEVER LOCAL ROOT FOLDER YOU WANT TO USE
    const rootFolder = "/Users/chris/enterprise/react-speech-recognition-example"

    // generate file structure from the passed in folder
    const { fileStructure, includedFiles } = await buildFileStructureFromRootFolder(rootFolder)

    for (const filePath of includedFiles) {
        console.log("included file path:", filePath)
    }

    const lesson: ILesson = {
        id: 'fullstackcraft-website-example',
        name: 'Full Stack Craft Website Example',
        description: 'Learn about the Full Stack Craft Website codebase works!',
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
    const courseFilePath = path.join(process.cwd(), 'lesson.json');
    if (fs.existsSync(courseFilePath)) {
        fs.unlinkSync(courseFilePath);
    }

    // Use big-json for large objects
    const stringifyStream = bigJSON.createStringifyStream({
        body: lesson
    });

    stringifyStream.pipe(fs.createWriteStream(courseFilePath));
}

buildFileStructureFromRootFolderLessonExample();