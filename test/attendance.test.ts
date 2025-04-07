import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mockedToken, loginAndGetToken } from './utils/authHelper';
import { mockedAsEmployee } from './utils/authHelper';
import { mockedEmployee } from './utils/employeeHelper';
import { AttendanceStatus, OfficeScheduleDays, WorkScheduleStatus, WorkType } from '@prisma/client';
import { getTimeNow } from '../src/utils/getDays';

jest.mocked(prisma);
jest.mock('../src/utils/getDays');
jest.mocked('bcrypt');
jest.mocked('jsonwebtoken');

describe('Attendance Service Test', () => {
    let token: string;
    let employee: {};
    beforeAll(async () => {
        token = await mockedAsEmployee();
        employee = await mockedEmployee();
    });
    afterEach(async () => {
        jest.clearAllMocks();
    });
    it('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .post('/api/attendance/check-in')
            .set('Authorization', 'Invalid token');
        expect(response.status).toBe(401);
    });
    it('should return 404 if Data User is not found', async () => {
        prisma.user.findFirst = jest.fn().mockResolvedValue(null);
        const response = await request(app)
            .post('/api/attendance/check-in')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: 1,
                latitude: '0',
                longitude: '0',
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Data for user not found');
    });
    it('should return 409 if user already checked in', async () => {
        const userId = 2;
        const mockUser = {
            id: userId,
            employees: {
                id: 101,
            },
        };
        const existingAttendance = {
            id: 1,
            employeeId: 101,
            date: new Date(),
        };
        prisma.user.findFirst = jest.fn().mockResolvedValue(mockUser);
        prisma.attendance.findFirst = jest.fn().mockResolvedValue(existingAttendance);

        const response = await request(app)
            .post('/api/attendance/check-in')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: 1,
                latitude: '0',
                longitude: '0',
            });

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Data for attendance already exists');
    });
    it('should return 404 if employee office is not found', async () => {
        const userId = 2;
        const mockUser = {
            id: userId,
            employees: {
                id: 101,
            },
        };
        const existingAttendance = {
            id: 1,
            employeeId: 101,
            date: new Date(),
        };
        prisma.user.findFirst = jest.fn().mockResolvedValue(mockUser);
        prisma.attendance.findFirst = jest.fn().mockResolvedValue(null);

        prisma.employeeOffice.findFirst = jest.fn().mockResolvedValue(null);

        const response = await request(app)
            .post('/api/attendance/check-in')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: 1,
                latitude: '0',
                longitude: '0',
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Data for employee office not found');
    });
    it('should return 201 if check in status WFH is successful', async () => {
        const mockEmployeeOffice = {
            employeeId: 101,
            isActive: true,
            office: {
                id: 1,
            },
        };
        prisma.employeeOffice.findFirst = jest.fn().mockResolvedValue(mockEmployeeOffice);
        prisma.employeeWorkSchedule.findFirst = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 101,
            scheduleDate: new Date(),
            workType: WorkType.WFH,
            status: WorkScheduleStatus.APPROVED,
        });

        prisma.attendance.create = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 101,
            latitude: '0',
            longitude: '0',
        });

        prisma.geolocation.create = jest.fn().mockResolvedValue({
            id: 1,
            attendanceId: 1,
            checkInLatitude: '0',
            checkInLongitude: '0',
        });

        prisma.$transaction = jest.fn().mockImplementation(async (callback) => {
            return await callback(prisma);
        });

        const response = await request(app)
            .post('/api/attendance/check-in')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: 1,
                latitude: '0',
                longitude: '0',
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Attendance created successfully');
    });
    it('should return 201 with status WFO is successful when status attendance is PRESENT', async () => {
        const mockEmployeeOffice = {
            id: 1,
            employeeId: 101,
            isActive: true,
            office: {
                id: 1,
            },
        };
        const mockOfficeSchedule = {
            id: 1,
            officeId: 1,
            day: OfficeScheduleDays.SENIN,
            work_start: '2025-03-19 09:00:00',
            work_end: '2025-03-19 17:00:00',
            break_start: null,
            break_end: null,
            late_tolerance: 15,
            early_tolerance: 15,
        };
        prisma.employeeOffice.findFirst = jest.fn().mockResolvedValue(mockEmployeeOffice);
        prisma.employeeWorkSchedule.findFirst = jest.fn().mockResolvedValue(null);
        prisma.officeSchedule.findFirst = jest.fn().mockResolvedValue(mockOfficeSchedule);
        const mockStatusTime = {
            time: new Date(), // Contoh waktu check-in
            status: 'PRESENT',
            nowWIB: new Date(new Date().getTime() + 7 * 60 * 60 * 1000),
        };
        (getTimeNow as jest.Mock).mockReturnValue(mockStatusTime);
        const mockAttendance = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 101,
            date: mockStatusTime.time,
            checkIn: mockStatusTime.time,
            status: mockStatusTime.status,
        });
        prisma.attendance.create = mockAttendance;
        prisma.geolocation.create = jest.fn().mockResolvedValue({
            id: 1,
            attendanceId: 1,
            checkInLatitude: '0',
            checkInLongitude: '0',
        });

        prisma.$transaction = jest.fn().mockImplementation(async (callback) => {
            return await callback(prisma);
        });
        const response = await request(app)
            .post('/api/attendance/check-in')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: 1,
                latitude: '0',
                longitude: '0',
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Attendance created successfully');
        const attendanceCreateArgs = mockAttendance.mock.calls[0][0];

        const nowJakarta = new Date(); // Use the current time in the test context
        const startTimeParts = mockOfficeSchedule.work_start.split(':').map(Number);
        const startTimeTodayJakarta = new Date(nowJakarta);
        startTimeTodayJakarta.setHours(startTimeParts[0], startTimeParts[1], startTimeParts[2], 0);
        startTimeTodayJakarta.setMinutes(
            startTimeTodayJakarta.getMinutes() - startTimeTodayJakarta.getTimezoneOffset() + 7 * 60,
        ); // Adjust to WIB
        let expectedStatus = 'PRESENT';
        if (nowJakarta > startTimeTodayJakarta) {
            expectedStatus = 'LATE'; // Or however your getTimeNow determines 'LATE'
        } else {
            expectedStatus = 'PRESENT'; // Or 'ON_TIME' depending on your logic
        }
        expect(response.body.data.status).toBe(expectedStatus);
        expect(attendanceCreateArgs.data.status).toBe(expectedStatus);
    });
    it('should return 201 with status WFO is successful when status attendance is LATE', async () => {
        const mockEmployeeOffice = {
            id: 1,
            employeeId: 101,
            isActive: true,
            office: {
                id: 1,
            },
        };
        const mockOfficeSchedule = {
            id: 1,
            officeId: 1,
            day: OfficeScheduleDays.SENIN,
            work_start: '2025-03-19 09:00:00',
            work_end: '2025-03-19 17:00:00',
            break_start: null,
            break_end: null,
            late_tolerance: 15,
            early_tolerance: 15,
        };
        prisma.employeeOffice.findFirst = jest.fn().mockResolvedValue(mockEmployeeOffice);
        prisma.employeeWorkSchedule.findFirst = jest.fn().mockResolvedValue(null);
        prisma.officeSchedule.findFirst = jest.fn().mockResolvedValue(mockOfficeSchedule);
        const mockStatusTime = {
            time: new Date(), // Contoh waktu check-in
            status: 'LATE',
            nowWIB: new Date(new Date().getTime() + 7 * 60 * 60 * 1000),
        };
        (getTimeNow as jest.Mock).mockReturnValue(mockStatusTime);
        const mockAttendance = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 101,
            date: mockStatusTime.time,
            checkIn: mockStatusTime.time,
            status: mockStatusTime.status,
        });
        prisma.attendance.create = mockAttendance;
        prisma.geolocation.create = jest.fn().mockResolvedValue({
            id: 1,
            attendanceId: 1,
            checkInLatitude: '0',
            checkInLongitude: '0',
        });

        prisma.$transaction = jest.fn().mockImplementation(async (callback) => {
            return await callback(prisma);
        });
        const response = await request(app)
            .post('/api/attendance/check-in')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: 1,
                latitude: '0',
                longitude: '0',
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Attendance created successfully');
        const attendanceCreateArgs = mockAttendance.mock.calls[0][0];
        const nowJakarta = new Date(); // Use the current time in the test context
        const startTimeParts = mockOfficeSchedule.work_start.split(':').map(Number);
        const startTimeTodayJakarta = new Date(nowJakarta);
        startTimeTodayJakarta.setHours(startTimeParts[0], startTimeParts[1], startTimeParts[2], 0);
        startTimeTodayJakarta.setMinutes(
            startTimeTodayJakarta.getMinutes() - startTimeTodayJakarta.getTimezoneOffset() + 7 * 60,
        ); // Adjust to WIB
        let expectedStatus = 'LATE';

        expect(response.body.data.status).toBe(expectedStatus);
        expect(attendanceCreateArgs.data.status).toBe(expectedStatus);
    });
    it('should return 400 if latitude or longitude is invalid', async () => {
        const mockOfficeSchedule = {
            id: 1,
            officeId: 1,
            day: OfficeScheduleDays.SENIN,
            work_start: '2025-03-19 09:00:00',
            work_end: '2025-03-19 17:00:00',
            break_start: null,
            break_end: null,
            late_tolerance: 15,
            early_tolerance: 15,
        };
        // -6.2623134,106.7620278
        const mockEmployeeOffice = {
            id: 1,
            employeeId: 101,
            isActive: true,
            office: {
                id: 1,
                latitude: -6.2623134,
                longitude: 106.7620278,
            },
        };

        prisma.employeeOffice.findFirst = jest.fn().mockResolvedValue(mockEmployeeOffice);
        prisma.employeeWorkSchedule.findFirst = jest.fn().mockResolvedValue(null);
        prisma.officeSchedule.findFirst = jest.fn().mockResolvedValue(mockOfficeSchedule);
        const mockStatusTime = {
            time: new Date(), // Contoh waktu check-in
            status: 'PRESENT',
            nowWIB: new Date(new Date().getTime() + 7 * 60 * 60 * 1000),
        };
        (getTimeNow as jest.Mock).mockReturnValue(mockStatusTime);
        const mockAttendance = jest.fn().mockResolvedValue({
            id: 1,
            employeeId: 101,
            date: mockStatusTime.time,
            checkIn: mockStatusTime.time,
            status: mockStatusTime.status,
        });
        prisma.attendance.create = mockAttendance;
        prisma.geolocation.create = jest.fn().mockResolvedValue({
            id: 1,
            attendanceId: 1,
            checkInLatitude: '0',
            checkInLongitude: '0',
        });

        prisma.$transaction = jest.fn().mockImplementation(async (callback) => {
            return await callback(prisma);
        });
        const response = await request(app)
            .post('/api/attendance/check-in')
            .set('Authorization', `Bearer ${token}`)
            .send({
                employeeId: 1,
                latitude: '0',
                longitude: '0',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('You are too far from the office');
    });
});
