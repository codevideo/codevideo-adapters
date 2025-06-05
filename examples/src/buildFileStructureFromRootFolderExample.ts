import fs from 'fs'
import { ICourse } from "@fullstackcraftllc/codevideo-types"
import { buildFileStructureFromRootFolder } from "@fullstackcraftllc/codevideo-adapters";
import path from 'path';
import * as bigJSON from 'big-json';

const buildFileStructureFromRootFolderExample = async () => {
    // CHANGE THIS LINE TO WHATEVER LOCAL ROOT FOLDER YOU WANT TO USE
    const rootFolder = "/Users/chris/enterprise/react-speech-recognition-example"

    // generate file structure from the passed in folder
    const {fileStructure, includedFiles} = await buildFileStructureFromRootFolder(rootFolder)

    for (const filePath of includedFiles) {
        console.log("included file path:", filePath)
    }

    const course: ICourse = {
        id: 'fullstackcraft-website-example',
        name: 'Full Stack Craft Website Example',
        description: 'Learn about the Full Stack Craft Website codebase works!',
        primaryLanguage: 'typescript',
        lessons: [
            {
                id: 'codebase-introduction',
                name: 'Introduction to the fullstackcraft.com codebase',
                description: 'Learn about the structure and key components of the Full Stack Craft website codebase.',
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
            }
        ]
    };

    // remove any course.json file if it exists
    const courseFilePath = path.join(process.cwd(), 'course.json');
    if (fs.existsSync(courseFilePath)) {
        fs.unlinkSync(courseFilePath);
    }

    // Use big-json for large objects
    const stringifyStream = bigJSON.createStringifyStream({
        body: course
    });
    
    stringifyStream.pipe(fs.createWriteStream(courseFilePath));
}

buildFileStructureFromRootFolderExample();