export type DepartmentOfficeResponse = {
    id: number;
    departmentId: number;
    officeId: number;
    startDate: Date;
    endDate?: Date | null;
};
