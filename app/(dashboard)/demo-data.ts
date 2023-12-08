import { Application, ValidStatus } from "@/types";
export const randomNotes = [
    'I really like this company!',
    'I think I have a good chance of getting an interview here.',
    'I think I have a good chance of getting an offer here.',
    'Ain\'t no way',
    'Ain\'t no way',
    'Ain\'t no way',
    'No shot in hell',
    'Hiring manager was nice!',
    'Hate the company but I need a job.',
    'I think I have a good chance of getting an offer here.',
    'I want this job so much!',
    '...',
    'Hiring manager was a jerk',
    'Seems very convenient',
    'Salary seems low',
    'Perks seem high!',
    'Great benefits!',
    'Team looks really nice!',
    'Company beliefs align with mine',
    'Office looks cool',
    '401k not included',
    'No free food? What the hell!?',
    'Seems like a good place to work',
    'Probably get rejected but oh well',
    'Damn, I really want this one',
    'This one is a stretch',
    'This one is a reach',
    'This one is a longshot',
    'I meet all these qualifications and then some!',
    'I meet all these qualifications and then some!',
    'Hmmm, I meet most of these qualifications',
];
// Function to generate a random element based on weights
function weightedRandom<T>(elements: T[], weights: number[]): T {
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    const rand = Math.random() * totalWeight;

    let currentWeight = 0;
    for (let i = 0; i < elements.length; i++) {
        currentWeight += weights[i];
        if (rand < currentWeight) {
            return elements[i];
        }
    }

    // Fallback if something goes wrong
    return elements[elements.length - 1];
}

// Function to generate a random date within a range
function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Function to generate a random status with customizable weights
function randomStatus(): string {
    const statuses: ValidStatus[] = ['To Apply', 'Applied', 'Rejected', 'Interview', 'Accepted Offer', 'Offered'];
    const weights = [20, 20, 90, 15, 1, 1]; // Adjust weights as needed

    return weightedRandom(statuses, weights);
}

// Function to generate demo data
export function generateDemoData(numApplications: number): Application[] {
    const demoCompanies = ['Google', 'Facebook', 'Netflix', 'Jira', 'Amazon', 'Wells Fargo', 'Spotify', 'Notion', 'Steam'];
    const demoPositions = ['Software Engineer', 'Data Scientist', 'Backend Developer', 'Frontend Developer', 'Fullstack Developer', 'Product Manager'];

    const applications: Application[] = [];

    for (let i = 1; i <= numApplications; i++) {
        const company = weightedRandom(demoCompanies, [4, 4, 3, 2, 2, 1, 1, 1, 1]);
        const position = weightedRandom(demoPositions, [5, 3, 3, 2, 2, 1]);
        const location = weightedRandom(['Mountain View', 'San Jose', 'San Francisco', 'Remote'], [4, 3, 2, 1]);
        const notes = randomNotes[Math.floor(Math.random() * randomNotes.length)];

        const currentDate = new Date();
        const fourMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 4, currentDate.getDate());

        let status = <ValidStatus>randomStatus();
        let statusUpdates: ValidStatus[] = [];
        switch(status) {
            case 'To Apply':
                statusUpdates = ['To Apply'];
                break;
            case 'Applied':
                statusUpdates = ['Applied'];
                break;
            case 'Rejected':
                statusUpdates = ['Applied', 'Rejected'];
                break;
            case 'Interview':
                const randomSeed = weightedRandom(['Rejected', 'Interview', 'Offered', 'Accepted Offer'], [15, 5, 3, 1]);
                switch(randomSeed) {
                    case 'Rejected':
                        status = 'Rejected';
                        statusUpdates = ['Applied', 'Interview', 'Rejected'];
                        break;
                    case 'Interview':
                        statusUpdates = ['Applied', 'Interview'];
                        break;
                    case 'Offer':
                        status = 'Offered';
                        statusUpdates = ['Applied', 'Interview', 'Offered'];
                        break;
                    case 'Accepted Offer':
                        status = 'Accepted Offer';
                        statusUpdates = ['Applied', 'Interview', 'Accepted Offer'];
                        break;
                } 
                break;
            case 'Accepted Offer':
                statusUpdates = ['Applied', 'Interview', 'Accepted Offer'];
                break;
            case 'Offered':
                statusUpdates = ['Applied', 'Interview', 'Offered'];
                break;
        }

        const application: Application = {
            _id: i.toString(),
            userExternalId: i.toString(),
            company,
            status: status,
            statusUpdates: statusUpdates,
            position,
            location,
            salary: `$${Math.floor(Math.random() * 100000) + 100000}-${Math.floor(Math.random() * 40000) + 100000}`,
            dateApplied: randomDate(fourMonthsAgo, currentDate).toISOString(),
            interviews: [],
            numInterviews: 0,
            links: [],
            notes: notes,
        };

        applications.push(application);
    }

    return applications;
}

// Usage
const numApplications = 150;
export const demoApplications = generateDemoData(numApplications);
export const demoPositions = ['Software Engineer', 'Data Scientist', 'Backend Developer', 'Frontend Developer', 'Fullstack Developer', 'Product Manager'];
export const demoCompanies = ['Google', 'Facebook', 'Netflix', 'Jira', 'Amazon', 'Wells Fargo', 'Spotify', 'Notion', 'Steam'];
export const demoLocations = ['Mountain View', 'San Jose', 'San Francisco', 'Remote'];

