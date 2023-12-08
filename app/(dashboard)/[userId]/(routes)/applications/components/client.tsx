"use client";

import { Plus } from "lucide-react";
import { ApplicationColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { Application } from "@/types";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  

interface ApplicationClientProps {
    applications: Application[];
    filterOptions: {
        positions: string[];
        companies: string[];
        locations: string[];
    }
}

const ApplicationClient: React.FC<ApplicationClientProps> = ({
    applications,
    filterOptions: {
        positions,
        companies,
        locations
    },
}) => {
    const params = useParams();
    const router = useRouter();

    const [positionFilter, setPositionFilter] = useState<string>("All");
    const [companyFilter, setCompanyFilter] = useState<string>("All");
    const [locationFilter, setLocationFilter] = useState<string>("All");

    const formattedApplications: ApplicationColumn[] = applications
        .filter(application => positionFilter === "All" || application.position === positionFilter)
        .filter(application => companyFilter === "All" || application.company === companyFilter)
        .filter(application => locationFilter === "All" || application.location === locationFilter)
        .map((application) => ({
            id: application._id,
            company: application.company,
            position: application.position,
            location: application.location,
            dateApplied: format(parseISO(application.dateApplied), "MM/dd/yy, hh:mmaaaaa'm'"),
            status: application.status,
            notes: application.notes,
    }));
    
    return (
        <div>
            <div className="flex justify-end">
                <Button onClick={() => router.push(`/${params.userId}/applications/new`)}>
                        <Plus className="mr-2 h-4 w-4" /> Add New
                </Button>
            </div>
            <Accordion type="single" collapsible>
                <AccordionItem value="filters">
                    <AccordionTrigger className="max-w-[15%] bg-primary rounded-2xl mb-3 p-3">
                        <div className="flex justify-center font-semibold text-white">
                            <h1>Filters</h1>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-7 gap-3 mt-3 rounded-3xl border-2 border-muted">
                            <div className="col-span-2">
                                <div className="flex justify-center mt-3 font-semibold">
                                    <h1>Filter By Company</h1>
                                </div>
                                <div className="mx-auto flex justify-center my-3 px-5">
                                    <Select
                                        value={companyFilter}
                                        onValueChange={(selectedValue) => setCompanyFilter(selectedValue)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue defaultValue={companyFilter} placeholder="Select a Company" className="bg-primary text-white rounded-lg px-3 py-1 mr-2" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.map((company) => (
                                            <SelectItem key={company} value={company}>
                                                {company}
                                            </SelectItem>
                                            ))}
                                            <SelectItem value="All">All</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="flex justify-center mt-3 font-semibold">
                                    <h1>Filter By Position</h1>
                                </div>
                                <div className="mx-auto flex justify-center my-3 px-5">
                                    <Select
                                        value={positionFilter}
                                        onValueChange={(selectedValue) => setPositionFilter(selectedValue)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue defaultValue={positionFilter} placeholder="Select a Position" className="bg-primary text-white rounded-lg px-3 py-1 mr-2" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {positions.map((position) => (
                                            <SelectItem key={position} value={position}>
                                                {position}
                                            </SelectItem>
                                            ))}
                                            <SelectItem value="All">All</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="flex justify-center mt-3 font-semibold">
                                    <h1>Filter By Location</h1>
                                </div>
                                <div className="mx-auto flex justify-center my-3 px-5">
                                    <Select
                                        value={locationFilter}
                                        onValueChange={(selectedValue) => setLocationFilter(selectedValue)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue defaultValue={locationFilter} placeholder="Select a Location" className="bg-primary text-white rounded-lg px-3 py-1 mr-2" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locations.map((location) => (
                                            <SelectItem key={location} value={location}>
                                                {location}
                                            </SelectItem>
                                            ))}
                                            <SelectItem value="All">All</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="flex justify-center mt-3 font-semibold">
                                    <h1>Clear Filters</h1>
                                </div>
                                <div className="flex justify-center font-semibold">
                                    <Button
                                        className="mx-auto my-3 bg-destructive"
                                        onClick={() => {
                                            setPositionFilter("All");
                                            setCompanyFilter("All");
                                            setLocationFilter("All");
                                        }}
                                        disabled={positionFilter === "All" && companyFilter === "All" && locationFilter === "All"}
                                    >
                                        <FontAwesomeIcon icon={faX} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <DataTable searchKey="company" columns={columns} data={formattedApplications}/>
        </div>
    );
}
 
export default ApplicationClient;