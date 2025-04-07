import { AttendanceStatus, OfficeScheduleDays } from '@prisma/client';

export const getDayName = (date: Date, locale: string = 'id-ID') => {
    const today = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date).toUpperCase();
    return OfficeScheduleDays[today as keyof typeof OfficeScheduleDays];
};
export const getTimeNow = (schedule: any, type: string) => {
    const currentTimeUTC = new Date();
    const timeStampNow = currentTimeUTC.getTime();
    const nowWIB = new Date(timeStampNow + 7 * 60 * 60 * 1000); //konversi UTC ke WIB

    const workTimeInUTC = new Date(type === 'start' ? schedule.work_start : schedule.work_end);
    console.log(workTimeInUTC);
    const workTimeInWIB = workTimeInUTC.getTime();

    const workInWIB = new Date(workTimeInWIB + 7 * 60 * 60 * 1000);

    if (type === 'start') {
        const workTimeTolerance = new Date(
            workTimeInWIB + 7 * 60 * 60 * 1000 + schedule.late_tolerance * 60000,
        );
        if (timeStampNow > workTimeTolerance.getTime()) {
            return {
                time: currentTimeUTC,
                status: AttendanceStatus.PRESENT,
                nowWIB,
            };
        } else {
            return {
                time: currentTimeUTC,
                status: AttendanceStatus.LATE,
                nowWIB,
            };
        }
    } else if (type === 'end') {
        //jika lebih dari jam 18 wib maka overtime
        if (nowWIB.getHours() > 18) {
            return {
                time: currentTimeUTC,
                status: AttendanceStatus.OVERTIME,
                nowWIB,
            };
        } else if (nowWIB.getHours() < 18 && nowWIB.getHours() > workInWIB.getHours()) {
            const workTimeTolerance = new Date(
                workTimeInWIB + 7 * 60 * 60 * 1000 + schedule.early_tolerance * 60000,
            );
            return {
                time: currentTimeUTC,
                status: AttendanceStatus.PRESENT,
                nowWIB,
            };
        }
    }

    return false;
};
