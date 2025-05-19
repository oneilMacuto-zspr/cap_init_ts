const { randomUUID } = require('crypto');
const constants = require("./constants")

const cds = require("@sap/cds");
const { getCurrentTime, formatHrTimeToHHMMSS } = require("./helper")
type ExecutionType = {
    uuid: ReturnType<typeof randomUUID>
    start: ReturnType<typeof process.hrtime> 
}
const arrExecutionKeys: Array<ExecutionType> = [];

// logger for Execution Start Time
function logStartTime(moduleName: string, serviceName: string, functionName: string = constants.BLANK) {
    const LOG = cds.log(moduleName, constants.LOG_LEVEL)
    const fnName : string = functionName ? ` - ${functionName}` : constants.BLANK;
    LOG.info(`${serviceName}${fnName}${constants.EXEC_TIME}${getCurrentTime()}`)
    const uuid: ReturnType<typeof randomUUID> = randomUUID();
    const start: ReturnType<typeof process.hrtime>  = process.hrtime(); // start timer
    arrExecutionKeys.push({uuid, start}); // store start time with key
    return uuid; // return key
}

// logger for Execution End Time and Total Time Taken
function logEndTime(moduleName: string, serviceName: string, uuid: ReturnType<typeof randomUUID>, functionName: string = constants.BLANK) {
    const LOG = cds.log(moduleName, constants.LOG_LEVEL)
    const start = arrExecutionKeys.find((r) => r.uuid === uuid)?.start // get start time from key
    const timeDiff = process.hrtime(start)
    const timeTaken: string = formatHrTimeToHHMMSS(timeDiff);
    const fnName : string = functionName ? ` - ${functionName}` : constants.BLANK;
    LOG.info(`${serviceName}${fnName}${constants.EXEC_TIME}${getCurrentTime()}`)
    LOG.info(`${serviceName}${fnName}${constants.TOTAL_TIME_TAKEN}${timeTaken}`)
    
    deleteExecutionKey(uuid) // remove used uuid
}

// logger for API Call Input
function logGetAPICallStartKey() {
    const uuid: ReturnType<typeof randomUUID> = randomUUID();
    const start: ReturnType<typeof process.hrtime>  = process.hrtime(); // start timer
    arrExecutionKeys.push({uuid, start}); // store start time with key
    return uuid; // return key
}

// logger for API Call Response
function logAPIResponse(moduleName: string, serviceName: string, functionName: string, uuid: ReturnType<typeof randomUUID>, url: string, jsonBody: string, resStatus: number, jsonResponse: string) {
    const LOG = cds.log(moduleName, constants.LOG_LEVEL)
    const start = arrExecutionKeys.find((r) => r.uuid === uuid)?.start // get start time from key
    const timeDiff = process.hrtime(start)
    const timeTaken: string = formatHrTimeToHHMMSS(timeDiff)
    const fnName : string = functionName ? ` - ${functionName}` : constants.BLANK;
    const logDetails = {
        "log": `${serviceName}${fnName}${constants.API_EXEC_SUCCESS}`,
        "Request URL": url,
        "Request Body": jsonBody,
        "Response Status Code": resStatus,
        "Response Message": jsonResponse,
        "Time Taken to Complete": timeTaken,
    }
    LOG.info(JSON.stringify(logDetails))

    deleteExecutionKey(uuid) // remove used uuid
}

// logger for API Call Error
function logAPIError(moduleName: string, serviceName: string, functionName: string, uuid: ReturnType<typeof randomUUID>, url: string, jsonBody: string, errStatus: number, jsonErrMessage: string) {
    const LOG = cds.log(moduleName, constants.LOG_LEVEL)
    const start = arrExecutionKeys.find((r) => r.uuid === uuid)?.start // get start time from key
    const timeDiff = process.hrtime(start)
    const timeTaken: string = formatHrTimeToHHMMSS(timeDiff)
    const fnName : string = functionName ? ` - ${functionName}` : constants.BLANK;
    const logDetails = {
        "log": `${serviceName}${fnName}${constants.API_EXEC_FAILED}`,
        "Request URL": url,
        "Request Body": jsonBody,
        "Error Status Code": errStatus,
        "Error Message": jsonErrMessage,
        "Time Taken to Complete": timeTaken,
    }
    LOG.info(JSON.stringify(logDetails))

    deleteExecutionKey(uuid) // remove used uuid
}

function deleteExecutionKey(uuid: ReturnType<typeof randomUUID>) {
    // remove used uuid
    const index = arrExecutionKeys.findIndex((r) => r.uuid === uuid);
    if (index !== -1) {
        arrExecutionKeys.splice(index, 1); // removes 1 item at the found index
    }
}

module.exports = {
    logStartTime,
    logEndTime,
    logGetAPICallStartKey,
    logAPIResponse,
    logAPIError,
}