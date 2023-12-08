"use client";

import { Application } from "@/types";
import 'react-calendar-heatmap/dist/styles.css';
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useIsVisible } from "@/hooks/use-is-visible";
import { useRef } from "react";
import 'react-calendar-heatmap/dist/styles.css';
import './calendar-styles.css'

interface StatsOverviewProps {
    applications: Application[];
    positions: string[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
    applications,
    positions,
}) => {
    const refHeatmap = useRef();
    const isVisible1 = useIsVisible(refHeatmap);
    const [positionFilter, setPositionFilter] = useState<string>("None");

    if (positionFilter !== "None") {
        applications = applications.filter((application) => application.position === positionFilter);
    }

    const numRejected = applications.filter((application) => application.status === "Rejected").length;
    const numPending = applications.filter((application) => (application.status !== "Rejected") && (application.status !== "Offered")).length;
    const numInterviews = applications.filter((application) => application.statusUpdates.includes("Interview")).length;

    return (
        <div
        /*
        // @ts-ignore */
        ref={refHeatmap} 
        className={`transition-opacity ease-in duration-500 relative ${isVisible1 ? "opacity-100" : "opacity-10"}`}
        >   
                <div className="absolute top-[-5.5rem] right-[1%] flex items-center mb-3 z-10">
                    <div className="text-[5.5rem] font-bold opacity-50 text-primary">
                        <h1 style={{ background: 'linear-gradient(to right, #9FD47B, #CEE3CE)', WebkitBackgroundClip: 'text', color: 'transparent' }}>STATS</h1>
                    </div>
                </div>
                <div className="relative mb-[5rem] bg-muted border-4 border-primary px-2 py-5 lg:p-5 rounded-3xl z-20">
                    <div className="relative my-auto space-y-0">
                        {/* Add buttons to change starting variable and refresh page */}
                        <div className="flex items-center mb-3 z-20">
                            <div className="font-semibold">
                                <h1>Filter By Position:</h1>
                            </div>
                            <div className="ml-2 my-auto max-w-[65%]">
                                <Select
                                    value={positionFilter}
                                    onValueChange={(selectedValue) => setPositionFilter(selectedValue)}
                                >
                                    <SelectTrigger>
                                        <SelectValue defaultValue={positionFilter} placeholder="Select a Position" className="bg-primary text-white rounded-lg px-3 py-1 mr-2" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="None">None</SelectItem>
                                        {positions.map((position) => (
                                        <SelectItem key={position} value={position}>
                                            {position}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                </div>
                <div className="grid grid-cols-4 gap-x-2 lg:gap-x-4">
                    <div className="rounded-2xl border-4 border-secondary p-1 lg:p-4">
                        <h1 className="text-center font-bold text-xs lg:text-2xl">Total Apps</h1>
                        <p className="text-center font-semibold text-lg pt-2">{applications.length}</p>
                    </div>
                    <div className="rounded-2xl border-4 border-secondary p-1 lg:p-4">
                        <h1 className="text-center font-bold text-xs lg:text-2xl">Rejected</h1>
                        <p className="text-center font-semibold text-lg pt-2">{numRejected}</p>
                        <p className="text-center font-medium text-base pt-2">({((numRejected / applications.length) * 100).toFixed(2)}%)</p>
                    </div>
                    <div className="rounded-2xl border-4 border-secondary p-1 lg:p-4">
                        <h1 className="text-center font-bold text-xs lg:text-2xl">Pending</h1>
                        <p className="text-center font-semibold text-lg pt-2">{numPending}</p>
                        <p className="text-center font-medium text-base pt-2">({((numPending / applications.length) * 100).toFixed(2)}%)</p>
                    </div>
                    <div className="rounded-2xl border-4 border-secondary p-1 lg:p-4">
                        <h1 className="text-center font-bold text-xs lg:text-2xl">Interviews</h1>
                        <p className="text-center font-semibold text-lg pt-2">{numInterviews}</p>
                        <p className="text-center font-medium text-base pt-2">({((numInterviews / applications.length) * 100).toFixed(2)}%)</p>
                    </div>
                </div>
            </div>
      </div>
    );
}
 
export default StatsOverview;