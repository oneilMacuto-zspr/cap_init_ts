const { randomUUID } = require('crypto');

const cds = require("@sap/cds");
const { getCurrentTime, formatHrTimeToHHMMSS } = require("../helpers")
type ExecutionType = {
    uuid: ReturnType<typeof randomUUID>
    start: ReturnType<typeof process.hrtime> 
}
const arrExecutionKeys: Array<ExecutionType> = [];

// logger for Execution Start Time
function logStartTime(moduleName: string, serviceName: string, functionName: string = "") {
    const LOG = cds.log(moduleName, "INFO")
    const fnName : string = functionName ? ` - ${functionName}` : "";
    LOG.info(`${serviceName}${fnName} - Execution Start Time: ${getCurrentTime()}`)
    const uuid: ReturnType<typeof randomUUID> = randomUUID();
    const start: ReturnType<typeof process.hrtime>  = process.hrtime(); // start timer
    arrExecutionKeys.push({uuid, start}); // store start time with key
    return uuid; // return key
}

// logger for Execution End Time and Total Time Taken
function logEndTime(moduleName: string, serviceName: string, uuid: ReturnType<typeof randomUUID>, functionName: string = "") {
    const LOG = cds.log(moduleName, "INFO")
    const start = arrExecutionKeys.find((r) => r.uuid === uuid)?.start // get start time from key
    const timeDiff = process.hrtime(start)
    const timeTaken: string = formatHrTimeToHHMMSS(timeDiff)
    const fnName : string = functionName ? ` - ${functionName}` : "";
    LOG.info(`${serviceName}${fnName} - Execution End Time: ${getCurrentTime()}`)
    LOG.info(`${serviceName}${fnName} - Total Time Taken to Complete Processing: ${timeTaken}`)
    
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
    const LOG = cds.log(moduleName, "INFO")
    const start = arrExecutionKeys.find((r) => r.uuid === uuid)?.start // get start time from key
    const timeDiff = process.hrtime(start)
    const timeTaken: string = formatHrTimeToHHMMSS(timeDiff)
    const fnName : string = functionName ? ` - ${functionName}` : "";
    const logDetails = {
        "log": `${serviceName}${fnName} - API Call Execution Successful:`,
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
    const LOG = cds.log(moduleName, "INFO")
    const start = arrExecutionKeys.find((r) => r.uuid === uuid)?.start // get start time from key
    const timeDiff = process.hrtime(start)
    const timeTaken: string = formatHrTimeToHHMMSS(timeDiff)
    const fnName : string = functionName ? ` - ${functionName}` : "";
    const logDetails = {
        "log": `${serviceName}${fnName} - API Call Execution Failed:`,
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