"use client";

import { Application } from "@/types";
import { useState, useEffect } from "react";
import Chart from "react-google-charts";
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForwardFast, faForwardStep, faPause, faPlay, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { Progress } from "@/components/ui/progress";
import { ClockLoader } from "react-spinners";
import { format, parseISO } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SankeyDiagramProps {
    applications: Application[];
    positions: string[];
}

type StartingVariable = "Position" | "Company" | "Location" | "Applied";

export const options = {
    sankey: {
      iterations: 32,
      link: { 
          colorMode: "gradient",
          colors: ["#6EAC6C", "#4D864B", "#2F5D2B", "#CEE3CE", "#1C311C"],
        },
        node: {
          nodePadding: 20,
          colors: ["#6EAC6C"],
          label: { 
            color: "#ffffff",
            bold: true,
            fontSize: 12, 
        },
        interactivity: true,
      },
    },
  };

const SankeyDiagram: React.FC<SankeyDiagramProps> = ({
    applications,
    positions,
}) => {
    const [startingVariable, setStartingVariable] = useState<StartingVariable>("Applied");
    const [positionFilter, setPositionFilter] = useState<string>("None");

    const [currentApplications, setCurrentApplications] = useState<Application[]>(applications);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isFastForward, setIsFastForward] = useState(false);
    const [currentTime, setCurrentTime] = useState<number>(0);

    useEffect(() => {
        setCurrentApplications(applications);
        setCurrentIndex(applications.length > 0 ? applications.length - 1 : 0);
    }, [applications]);

    useEffect(() => {
        if (!isAnimating) return;
        
        let delay = 500;
        if (isFastForward) delay = 125;
        const timer = setTimeout(() => {
          if (currentIndex === applications.length - 1) {
            setIsAnimating(false);
            return;
          }
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }, delay);
    
        return () => clearTimeout(timer);
    }, [currentIndex, isAnimating, isFastForward]);
    
    const startAnimation = () => {
    if (currentIndex === applications.length - 1) {
        setCurrentIndex(0);
    }
    setIsAnimating(true);
    };

    const stopAnimation = () => {
    setIsAnimating(false);
    };

    const restartAnimation = () => {
    setCurrentIndex(0);
    setIsAnimating(true);
    };
    
    useEffect(() => {
    setCurrentApplications(applications.slice(0, currentIndex + 1));
    }, [applications, currentIndex]);

    useEffect(() => {
    setCurrentApplications(applications.slice(0, currentIndex + 1).filter((application) => {
        if (positionFilter === "None") return true;
        return application.position.toLowerCase().includes(positionFilter.toLowerCase());
    }));
    }, [applications, currentIndex, positionFilter]);

    const formattedApplications: [string, string, number][] = [];

    currentApplications.forEach((application) => {
        const statusUpdates: string[] = application.statusUpdates;
        switch(startingVariable) {
            case "Position":
                // formattedApplications.push([application.position, statusUpdates[0], 50]);
                if (statusUpdates[0] === "To Apply") {
                    formattedApplications.push([application.position, "To Apply", 5]);
                    formattedApplications.push(["To Apply", "Pending", 5]);
                }
                if (statusUpdates[0] === "Applied") {
                    if (statusUpdates.length <= 1) {
                        formattedApplications.push([application.position, "Pending", 25]);
                        formattedApplications.push(["Pending", "No Response", 15]);
                    } else {
                        if (statusUpdates[1] === "Rejected") {
                            formattedApplications.push([application.position, `Rejected (Applied)`, 50]);
                            formattedApplications.push([`Rejected (Applied)`, "Rejected", 30]);
                        } else {
                            formattedApplications.push([application.position, statusUpdates[1], 50]);
                        }
                    }
                }
                break;
            case "Company":
                // formattedApplications.push([application.company, statusUpdates[0], 50]);
                if (statusUpdates[0] === "To Apply") {
                    formattedApplications.push([application.company, "To Apply", 5]);
                    formattedApplications.push(["To Apply", "Pending", 5]);
                }
                if (statusUpdates[0] === "Applied") {
                    if (statusUpdates.length <= 1) {
                        formattedApplications.push([application.company, "Pending", 25]);
                        formattedApplications.push(["Pending", "No Response", 15]);
                    } else {
                        if (statusUpdates[1] === "Rejected") {
                            formattedApplications.push([application.company, `Rejected (Applied)`, 50]);
                            formattedApplications.push([`Rejected (Applied)`, "Rejected", 30]);
                        } else {
                            formattedApplications.push([application.company, statusUpdates[1], 50]);
                        }
                    }
                }
                break;
            case "Location":
                // formattedApplications.push([application.location, statusUpdates[0], 50]);
                if (statusUpdates[0] === "To Apply") {
                    formattedApplications.push([application.location, "To Apply", 5]);
                    formattedApplications.push(["To Apply", "Pending", 5]);
                }
                if (statusUpdates[0] === "Applied") {
                    if (statusUpdates.length <= 1) {
                        formattedApplications.push([application.location, "Pending", 25]);
                        formattedApplications.push(["Pending", "No Response", 15]);
                    } else {
                        if (statusUpdates[1] === "Rejected") {
                            formattedApplications.push([application.location, `Rejected (Applied)`, 50]);
                            formattedApplications.push([`Rejected (Applied)`, "Rejected", 30]);
                        } else {
                            formattedApplications.push([application.location, statusUpdates[1], 50]);
                        }
                    }
                }
                break;
            case "Applied":
                break;
        }
  
        for (let i = 0; i < statusUpdates.length - 1; i++) {
            const fromStatus: string = statusUpdates[i];
            const toStatus: string = statusUpdates[i + 1];

            if (fromStatus === toStatus) continue;
            if (fromStatus === "To Apply") continue;
            if (fromStatus === "Applied" && startingVariable !== "Applied") continue;
            if (toStatus === "To Apply") continue;
            if (toStatus === "Applied") continue;
            if (toStatus === "Rejected") {
                formattedApplications.push([fromStatus, `Rejected (${fromStatus})`, 50]);
                formattedApplications.push([`Rejected (${fromStatus})`, "Rejected", 30]);
                continue;
            }
            if (toStatus === "Accepted Offer") {
                formattedApplications.push([fromStatus, toStatus, 50]);
                continue;
            }
  
            const node: [string, string, number] = [fromStatus, toStatus, 30];
            formattedApplications.push(node);
        }
        if (statusUpdates.length === 1 && statusUpdates[0] === "Applied" && startingVariable === "Applied") {
            formattedApplications.push(["Applied", "Pending", 35]);
            formattedApplications.push(["Pending", "No Response", 25]);
        }
    });


    const data = [["From", "To", "Weight"], ...formattedApplications];
    const hasData = data.length > 1;

    let currentDate = format(Date.now(), "MM/dd/yy, hh:mmaaaaa'm'");
    if (currentApplications.length > 0) {
        currentDate = format(parseISO(currentApplications[currentApplications.length - 1].dateApplied), "MM/dd/yy, hh:mmaaaaa'm'");
    }

    return (
        <div className="my-auto">
            <div className="mb-2">
                <div className="flex justify-between my-3">
                    <h1 className="text-3xl font-bold">
                        {positionFilter !== "None" ? `${positionFilter}: ` : "All Apps: "} {currentApplications.length}
                    </h1>
                    <h1 className="text-xl font-medium">
                        Up to: {currentDate}
                    </h1>
                </div>
            </div>
            <div className="min-h-[25rem]">
                {applications.length === 0 ? (
                    <Skeleton className="w-20 h-20"/>
                    ) : (
                        <div>
                            {hasData ? (
                                <Chart
                                chartType="Sankey"
                                width="100%"
                                height="400px"
                                data={data}
                                options={options}
                                />
                            ) : (
                                <div className="flex flex-col justify-center items-center w-[100%] h-[400px]">
                                    <ClockLoader color="#fff" size={50} />
                                    <p className="block mt-5 font-semibold">Not Enough Matching Data Yet</p>
                                </div>
                            )}
                        </div>
                )}  
            </div>
            <div>
                <div className="flex justify-center my-3">
                    <h1 className="text-lg font-bold">Timelapse</h1>
                </div>
            </div>
            <div className="flex justify-center mt-3 mx-auto w-[60%]">
                <Button
                    className={`bg-primary text-white rounded-lg px-3 py-1 mr-2`}
                    onClick={isAnimating ? stopAnimation : startAnimation}
                    disabled={false} // You can add a condition here if needed
                >
                    <FontAwesomeIcon className="h-4 w-4" icon={isAnimating ? faPause : faPlay} />
                </Button>
                <Button
                    className={`${
                        !isAnimating 
                            ? "bg-primary text-white"
                            : "bg-secondary text-primary"
                    } rounded-lg px-3 py-1 mr-2`}
                    onClick={restartAnimation}
                    disabled={isAnimating}
                    >
                    <FontAwesomeIcon className="h-4 w-4" icon={faRotateRight} />
                </Button>
                <Button
                    className={`bg-primary text-white rounded-lg px-3 py-1 mr-2`}
                    onClick={() => setIsFastForward(!isFastForward)}
                    >
                    {!isFastForward ? (
                        <FontAwesomeIcon className="h-4 w-4" icon={faForwardStep} />
                    ): (
                        <FontAwesomeIcon className="h-4 w-4" icon={faForwardFast} />
                    )}
                </Button>
                <Progress className="transition-all my-auto" value={(currentIndex / (applications.length - 1)) * 100}/>
            </div>
            
            {/* Add buttons to change starting variable and refresh page */}
            <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="rounded-3xl border-2 border-accent">
                    <div className="flex justify-center mt-3 font-semibold">
                        <h1>Set Start Variable</h1>
                    </div>
                    <div className="flex justify-center my-3 overflow-auto">
                        <Button
                            className={`${
                                startingVariable === "Applied"
                                ? "bg-primary text-white"
                                : "bg-secondary text-primary"
                            } rounded-lg px-3 py-1 mr-2`}
                            onClick={() => setStartingVariable("Applied")}
                            >
                            Applied
                        </Button>
                        <Button
                            className={`${
                                startingVariable === "Company"
                                ? "bg-primary text-white"
                                : "bg-secondary text-primary"
                            } rounded-lg px-3 py-1 mr-2`}
                            onClick={() => setStartingVariable("Company")}
                            >
                            Company
                        </Button>
                        <Button
                            className={`${
                                startingVariable === "Position"
                                ? "bg-primary text-white"
                                : "bg-secondary text-primary"
                            } rounded-lg px-3 py-1 mr-2`}
                            onClick={() => setStartingVariable("Position")}
                            >
                            Position
                        </Button>
                        <Button
                            className={`${
                                startingVariable === "Location"
                                ? "bg-primary text-white"
                                : "bg-secondary text-primary"
                            } rounded-lg px-3 py-1 mr-2`}
                            onClick={() => setStartingVariable("Location")}
                            >
                            Location
                        </Button>
                    </div>
                </div>
                <div className="rounded-3xl border-2 border-accent">
                    <div className="flex justify-center mt-3 font-semibold">
                        <h1>Filter By Position</h1>
                    </div>
                    <div className="mx-auto flex justify-center my-3 max-w-[65%]">
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
      </div>
    );
}
 
export default SankeyDiagram;