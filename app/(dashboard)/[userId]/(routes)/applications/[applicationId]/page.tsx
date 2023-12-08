import getApplication from "@/actions/get-application";
import { ApplicationForm } from "./components/application-form";
import { Application } from "@/types";


const ApplicationPage = async ({
    params
}: {
    params: { userName: string, applicationId: string }
}) => {

    let application: Application | null = null;
    if (params.applicationId !== "new") {
        application = await getApplication(params.applicationId);
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ApplicationForm initialData={application} />
            </div>
        </div>
    );
}
 
export default ApplicationPage;