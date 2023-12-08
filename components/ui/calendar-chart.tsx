"use client";

import { Application } from "@/types";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { useState, useEffect } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useIsVisible } from "@/hooks/use-is-visible";
import { useRef } from "react";
import 'react-calendar-heatmap/dist/styles.css';
import { Chart } from "react-google-charts";
import './calendar-styles.css'
import { Badge } from "./badge";
import { Grenze } from "next/font/google";

interface CalendarChartProps {
    applications: Application[];
    positions: string[];
}

type CalendarEntry = {
    date: string;
    count: number;
}
type CalendarEntryClickValues = Map<string, string[][]>;
type TinyBarChartValues = {
    month: string;
    count: number;
}
export const options = {
    legend: { position: "none" },
    color: ['green'],
    chartArea: {
        left: 0,
        top: 0,
        width: "100%",
        height: "50%",

    },
};

const CalendarChart: React.FC<CalendarChartProps> = ({
    applications,
    positions,
}) => {
    const refHeatmap = useRef();
    const isVisible1 = useIsVisible(refHeatmap);
    const [positionFilter, setPositionFilter] = useState<string>("None");

    const CalendarEntryClickValues: CalendarEntryClickValues = new Map();

    const monthlyCounts: Record<string, number> = {};
    const screenSize = window.innerWidth;
    let length;
    if (screenSize < 600) {
        // Small screen
        length = 90;
    } else if (screenSize < 1024) {
        // Medium screen
        length = 180;
    } else {
        // Large screen
        length = 365;
    }

    // Generate an array of CalendarEntry objects for each day in the past year
    const formattedApplications: CalendarEntry[] = Array.from({ length }, (_, index) => {
        const currentDate = new Date();
        const currentDay = new Date(currentDate);
        currentDay.setDate(currentDate.getDate() - index);

        // Calculate count by filtering applications whose dateApplied falls on the current day
        const count = applications.filter((application) => {
            const applicationDate = parseISO(application.dateApplied);
            return isSameDay(applicationDate, currentDay) && (application.position === positionFilter || positionFilter === "None");
        }).length;

        const formattedDate = format(currentDay, 'yyyy-MM-dd');
        const detailedInfoList = applications
            .filter((application) => {
                const applicationDate = parseISO(application.dateApplied);
                return isSameDay(applicationDate, currentDay);
            })
            .map((application) => {
                return [application.position, application.company, application.location, application.status];
            });

        // Add the detailedInfoList to CalendarEntryClickValues map
        CalendarEntryClickValues.set(formattedDate, detailedInfoList);

        // Update monthly count
        const monthKey = format(currentDay, 'MMM');
        monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + count;

        return {
            date: formattedDate,
            count,
        };
    });
    const barChartData: TinyBarChartValues[] = [];
    for (const [month, count] of Object.entries(monthlyCounts)) {
        barChartData.push({
            month,
            count,
        });
    }

    const [currentDayInfo, setCurrentDayInfo] = useState<JSX.Element>(
        <div className="flex flex-col">
            <div className="flex flex-row">
                <p style={{ background: 'linear-gradient(to right, #9FD47B, #CEE3CE)', WebkitBackgroundClip: 'text', color: 'transparent' }} className="text-xl font-semibold mx-auto">Click on a day to see more information.</p>
            </div>
        </div>
    );

    const updateCurrentDayInfo = (date: string, apps: string[][]) => {
        const currentDayInfo = (
            <div className="flex flex-col">
                <div className="flex justify-between mb-2">
                    <h1 className="text-2xl font-bold">Date: {date}</h1>
                    <h1 className="text-2xl font-bold">Total: {apps.length}</h1>
                </div>
                <div className="border-4 border-secondary">
                    <div className="h-[12rem] overflow-auto w-full">
                        <table className="table-auto mx-auto w-full">
                            <thead className="sticky top-0 z-30 bg-muted border-b-2 border-b-secondary">
                                <tr className="grid grid-cols-4">
                                    <th className="px-4 py-2">Company</th>
                                    <th className="px-4 py-2">Position</th>
                                    <th className="px-4 py-2">Location</th>
                                    <th className="px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apps.length === 0 && (
                                    <div className="mt-[3.5rem] flex justify-center align-middle">
                                        <p className="m-auto text-xl font-semibold">No applications submitted on this day :(</p>
                                    </div>
                                )}
                                {apps
                                    .map((row) => (
                                    <tr key={row.join(', ')} className="grid grid-cols-4">
                                        <td className="border px-4">{row[0]}</td>
                                        <td className="border px-4">{row[1]}</td>
                                        <td className="border px-4">{row[2]}</td>
                                        <div className="border px-4">
                                            <div className="p-1">
                                            {(() => {
                                                switch (row[3]) {
                                                    case "Rejected":
                                                        return <Badge variant={"destructive"}>{row[3]}</Badge>;
                                                    case "Applied":
                                                    case "Interview":
                                                        return <Badge variant={"secondary"}>{row[3]}</Badge>;
                                                    case "To Apply":
                                                        return <Badge variant={"outline"}>{row[3]}</Badge>;
                                                    case "Offered":
                                                        return <Badge>{row[3]}!</Badge>;
                                                    case "Accepted Offer":
                                                        return <Badge>Accepted!</Badge>;
                                                    default:
                                                        return <Badge>{row[3]}</Badge>;
                                                }
                                            })()}
                                            </div>
                                        </div>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
        setCurrentDayInfo(currentDayInfo);
    }

    const currentDate = new Date();
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    // Calculate the start date
    let monthsToShow = 0;
    if (screenSize < 600) {
        // Small screen
        monthsToShow = 4;
    } else if (screenSize < 1024) {
        // Medium screen
        monthsToShow = 6;
    } else {
        // Large screen
        monthsToShow = 12;
    }
    const startDate = new Date(endOfMonth);
    startDate.setMonth(endOfMonth.getMonth() - monthsToShow);
    console.log(`Start Date: ${startDate.toISOString()}`);
    console.log(`End Date: ${endOfMonth.toISOString()}`);

    const getPath = (x: number, y: number, width: number, height: number) => (
        `M${x},${y + height}
         C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2}, ${y}
         C${x + width / 2},${y + height / 3} ${x + 2 * width / 3},${y + height} ${x + width}, ${y + height}
         Z`
      );
      
      const RoundedBar = (props: any) => {
        const { fill, x, y, width, height } = props;
      
        return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
      };


    return (
        <div
        /*
        // @ts-ignore */
        ref={refHeatmap} 
        className={`transition-opacity ease-in duration-500 relative ${isVisible1 ? "opacity-100" : "opacity-10"}`}
        >   
                <div className="absolute top-[-5.5rem] right-[1%] flex items-center mb-3 z-10">
                    <div className="text-[5.5rem] font-bold opacity-50 text-primary">
                        <h1 style={{ background: 'linear-gradient(to right, #9FD47B, #CEE3CE)', WebkitBackgroundClip: 'text', color: 'transparent' }}>HEATMAP</h1>
                    </div>
                </div>
                <div className="relative my-[5rem] bg-muted border-4 border-primary px-2 py-5 lg:p-5 rounded-3xl z-20">
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
                            <div className="ml-2">
                                <p className="text-sm">(This will only affect the heatmap and bars)</p>
                            </div>
                        </div>
                        {/* <Chart 
                            options={options}
                            chartType="Bar"
                            width="100%"
                            height="100px"
                            data={[...monthlyChartData, ["Month", "Applications"]].reverse()} // Add and reverse the order of the columns
                        /> */}


                        <CalendarHeatmap
                            startDate={startDate}
                            endDate={endOfMonth}
                            values={formattedApplications}
                            gutterSize={1}
                            showOutOfRangeDays={true}
                            showMonthLabels={true}
                            showWeekdayLabels={true}
                            weekdayLabels={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
                            classForValue={(value) => {
                                if (!value) {
                                    return 'color-empty';
                                }
                                if (value.count === 0) {
                                    return 'color-empty';
                                } else if (value.count <= 1) {
                                    return `color-scale-1`;
                                } else if (value.count <= 2) {
                                    return `color-scale-2`;
                                } else if (value.count <= 3) {
                                    return `color-scale-3`;
                                } else if (value.count <= 4) {
                                    return `color-scale-4`;
                                } else if (value.count <= 6) {
                                    return `color-scale-5`;
                                } else if (value.count <= 9) {
                                    return `color-scale-6`;
                                } else if (value.count <= 13) {
                                    return `color-scale-7`;
                                } else {
                                    return `color-scale-8`;
                                }
                            }}
                            onClick={(value) => {
                                if (value && value.date) {
                                    const detailedInfoList = CalendarEntryClickValues.get(value.date) || [];
                                    updateCurrentDayInfo(value.date, detailedInfoList);
                                }
                            }}
                            titleForValue={(value) => {
                                return value
                                    ? `${format(parseISO(value.date), 'yyyy-MM-dd')}\nApplications Submitted: ${value.count}`
                                    : '';
                            }}
                        />
                        <ResponsiveContainer width="98.5%" height={100} style={{ transform: 'rotateX(180deg)', marginTop: '-4.5%' }}>
                            <BarChart className="pl-[1.2rem] md:pl-0" width={280} height={50} data={[...barChartData].reverse()}>
                                <Bar dataKey="count" fill="#4D864B" shape={<RoundedBar />} />
                            </BarChart>
                        </ResponsiveContainer>
                        <div>
                            <p className="text-sm mb-5">Hover over a day to see a quick count, or click on a day to see the list of apps.</p>
                        </div>
                        <div>
                            {currentDayInfo}
                        </div>

                </div>
            </div>
      </div>
    );
}
 
export default CalendarChart;