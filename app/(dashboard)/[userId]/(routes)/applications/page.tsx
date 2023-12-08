import Container from "@/components/ui/container";
import { format, parseISO } from "date-fns";
import axios from "axios";
import ApplicationClient from "./components/client";

import { ApplicationColumn } from "./components/columns";
import { Application } from "@/types";

const BACKEND_URL = process.env.BACKEND_URL || "";

const ApplicationsPage = async ({
    params
}: {
    params: { userId: string }
}) => {
    const { userId } = params;

    const response = await axios.get(`${BACKEND_URL}/users/${userId}`);
    const user = response.data;
    const applications: Application[] = user.applications;

    const filterOptions = {
        positions: user.positions,
        companies: user.companies,
        locations: user.locations,
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