import format from "date-fns/format";
import differenceInMinutes from "date-fns/difference_in_minutes";
import differenceInCalendarDays from "date-fns/difference_in_calendar_days";
import isValid from "date-fns/is_valid";
import addDays from "date-fns/add_days";
import subDays from "date-fns/sub_days";
import addMinutes from 'date-fns/add_minutes'

const DateUtils = {
    format: format,
    differenceInMinutes: differenceInMinutes,
    differenceInCalendarDays: differenceInCalendarDays,
    isValid: isValid,
    addDays: addDays,
    subDays: subDays,
    addMinutes : addMinutes,
    isAfter: (date1, date2, compareTime) => {
        return compareDate(date1, date2, compareTime, "after");
    },
    isBefore: (date1, date2, compareTime) => {
        return compareDate(date1, date2, compareTime, "before");
    },
    isEqual: (date1, date2, compareTime) => {
        return compareDate(date1, date2, compareTime, "equal");
    },
    getDateObj: function(dateStr, format, delimiter) {
        if (dateStr) {
            let dateObj;
            if (format == "DDMMYYYY") {
                let dateArray;
                if (!delimiter) {
                    dateArray = [dateStr.slice(0, 2), dateStr.slice(2, 4), dateStr.slice(4)];
                } else {
                    dateArray = dateStr.split("" + delimiter);
                }
                if (typeof dateArray == "object" && dateArray.length > 2) {
                    const month = parseInt(dateArray[1], 10) - 1;
                    dateObj = new Date(dateArray[2], month, dateArray[0]);
                    return dateObj;
                }
            } else if (format == "YYYYMMDD") {
                let dateArray;
                if (!delimiter) {
                    dateArray = [dateStr.slice(0, 4), dateStr.slice(4, 6), dateStr.slice(6)];
                } else {
                    dateArray = dateStr.split("" + delimiter);
                }
                if (typeof dateArray == "object" && dateArray.length > 2) {
                    const month = parseInt(dateArray[1], 10) - 1;
                    dateObj = new Date(dateArray[0], month, dateArray[2]);
                    return dateObj;
                }
            } else if (format == "YYYY-MM-DD") {
                let dateArray = dateStr.split("-");

                if (typeof dateArray == "object" && dateArray.length > 2) {
                    const month = parseInt(dateArray[1], 10) - 1;
                    dateObj = new Date(dateArray[0], month, dateArray[2]);
                    return dateObj;
                }
            } else if (format == "hh:mm:ss") {
                let dateArray = dateStr.split(":");

                if (typeof dateArray == "object" && dateArray.length > 2) {
                    dateObj = new Date();
                    dateObj.setHours(dateArray[0], dateArray[1], dateArray[2], 0);
                    return dateObj;
                }
            } else if (format == "ISO8061") {
                const d = dateStr.split(/[^0-9]/);
                return new Date(d[0], d[1] - 1, d[2], d[3], d[4], d[5]);
            }
        }
        return null;
    },
    convertToTimeZone(date, offset) {
        var utc = date.getTime() + date.getTimezoneOffset() * 60000;
        var newDate = new Date(utc + 3600000 * offset);
        return newDate;
    }
};

function compareDate(date1, date2, compareTime, type) {
    if (!(date1 && date2)) return;
    if (!compareTime) {
        date1 = new Date(date1);
        date1.setHours(0, 0, 0, 0);
        date2 = new Date(date2);
        date2.setHours(0, 0, 0, 0);
    }
    if (type == "before") return date1.getTime() < date2.getTime();
    else if (type == "after") return date1.getTime() > date2.getTime();
    else if (type == "equal") return date1.getTime() == date2.getTime();
}
export default DateUtils;
