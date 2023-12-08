import Container from "@/components/ui/container";
import { Application } from "@/types";

import SankeyDiagram from "@/components/ui/sankey-diagram";
import CalendarChart from "@/components/ui/calendar-chart";
import StatsOverview from "@/components/ui/stats-overview";
import { demoApplications, demoPositions } from "./demo-data";

export default async function Home() {
  const applications: Application[] = demoApplications;
  const positions: string[] = demoPositions;

  return ( 
    <Container>
        <div className="mt-5">
            <div className="relative">
              <div className="absolute top-[-5.5rem] right-[1%] flex items-center mb-3 z-10">
                  <div className="text-[5.5rem] font-bold opacity-50 text-primary">
                    <h1 style={{ background: 'linear-gradient(to right, #9FD47B, #CEE3CE)', WebkitBackgroundClip: 'text', color: 'transparent' }}>SANKEY</h1>
                  </div>
              </div>
              <div className="relative mt-[6rem] w-[100%] h-[30%] bg-muted border-4 border-primary px-3 py-5 lg:p-5 rounded-3xl z-20">
                <SankeyDiagram positions={positions} applications={applications}/>
              </div>
            </div>
            <div className="h-[3rem]"></div>
            <CalendarChart positions={positions} applications={applications} />
            <div className="h-[3rem]"></div>
            <StatsOverview positions={positions} applications={applications} />
            <div className="h-[3rem]"></div>
        </div>
    </Container>
);
}
