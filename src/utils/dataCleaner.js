import fs from 'fs';

/**
 * Deletes the specified directory and all its contents.
 * @param {string} dirPath - The path to the directory to delete.
 */
function clearUserDataDir(dirPath) {
    if (fs.existsSync(dirPath)) {
        try {
            fs.rmSync(dirPath, { recursive: true, force: true });
            console.log(`Deleted user data directory: ${dirPath}`);
        } catch (error) {
            console.error(`Failed to delete user data directory: ${dirPath}`, error);
        }
    } else {
        console.log(`User data directory does not exist: ${dirPath}`);
    }
}

/**
 * Creates a new user data directory for parallel execution.
 * @param {string} dirPath - The path to the directory to create.
 */
function createNewUserDataDirForParallelExecution(dirPath) {
    if (!fs.existsSync(dirPath)) {
        try {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Created user data directory: ${dirPath}`);
        } catch (error) {
            console.error(`Failed to create user data directory: ${dirPath}`, error);
        }
    } else {
        console.log(`User data directory already exists: ${dirPath}`);
    }
}

export {
    clearUserDataDir,
    createNewUserDataDirForParallelExecution
};
