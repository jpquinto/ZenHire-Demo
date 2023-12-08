import Container from "@/components/ui/container";
import { format, parseISO } from "date-fns";
import axios from "axios";
import ApplicationClient from "./components/client";

import { ApplicationColumn } from "./components/columns";
import { Application } from "@/types";
import { demoApplications, demoCompanies, demoLocations, demoPositions } from "../demo-data";

const BACKEND_URL = process.env.BACKEND_URL || "";

const ApplicationsPage = async ({
    params
}: {
    params: { userId: string }
}) => {
    const applications: Application[] = demoApplications;
    const filterOptions = {
        positions: demoPositions,
        companies: demoCompanies,
        locations: demoLocations,
    }

    return ( 
        <Container>
            <div className="mt-5">
                <h1 className="text-3xl font-bold text-center">Applications</h1>
                <div className="mt-5 border-4 border-primary bg-muted p-5 rounded-3xl">
                    <ApplicationClient applications={applications} filterOptions={filterOptions} />
                </div>
            </div>
        </Container>
    );
}
 
export default ApplicationsPage;