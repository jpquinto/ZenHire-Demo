export interface User {
    name: string;
    externalId: string;
    applications: Application[];
    numApplications: number;
    interviews: Interview[];
    numInterviews: number;
    numRejected: number;
    numOffers: number;
    locations: string[];
    positions: string[];
}

export type ValidStatus = 'To Apply' | 'Applied' | 'Rejected' | 'Interview' | 'Accepted Offer' | 'Offered';
export interface Application {
    _id: string;
    userExternalId: string;
    company: string;
    status: ValidStatus;
    statusUpdates: ValidStatus[];
    position: string;
    location: string;
    salary: string;
    dateApplied: string;
    interviews: Interview[];
    numInterviews: number;
    links: string[];
    notes: string;
}

export interface Interview {
    userExternalId: string;
    applicationId: string;
    notes: string;
    date: Date;
}