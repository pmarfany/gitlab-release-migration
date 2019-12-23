// Modify node console to add colors

console.success = (message, ...optionalParams) => {
    console.log('\x1b[32m', message, ...optionalParams, '\x1b[0m');
}

console.error = (message, ...optionalParams) => {
    console.log('\x1b[31m', message, ...optionalParams, '\x1b[0m');
}