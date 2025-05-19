module.exports = {
    BLANK: "",
    EXEC_TIME: " - Execution Start Time: ",
    TOTAL_TIME_TAKEN: " - Total Time Taken to Complete Processing: ",
    API_EXEC_SUCCESS: " - API Call Execution Successful:",
    API_EXEC_FAILED: " - API Call Execution Failed:",
    LOG_LEVEL: process.env["ENV"] === "LOCAL" ? "DEBUG" : "ERROR",
}