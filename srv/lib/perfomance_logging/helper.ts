const moment = require('moment');

function getCurrentTime() {
    return moment().utc().toISOString();
}

function formatHrTimeToHHMMSS(hrtime: ReturnType<typeof process.hrtime> ) {
    const totalSeconds = hrtime[0] + hrtime[1] / 1e9;
  
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
  
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
  

module.exports = {
    getCurrentTime,
    formatHrTimeToHHMMSS,
}