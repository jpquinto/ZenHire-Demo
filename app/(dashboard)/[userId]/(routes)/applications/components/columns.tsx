"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type ApplicationColumn = {
  id: string;
  company: string;
  position: string;
  location: string;
  dateApplied: string;
  status: string;
  notes: string;
}

export const columns: ColumnDef<ApplicationColumn>[] = [
  {
    accessorKey: "dateApplied",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Applied
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "company",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "position",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Position
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      switch (row.original.status) {
        case "Rejected":
          return <Badge variant={"destructive"}>{row.original.status}</Badge>;
        case "Applied":
        case "Interview":
          return <Badge variant={"secondary"}>{row.original.status}</Badge>;
          break;
        case "To Apply":
          return <Badge variant={"outline"}>{row.original.status}</Badge>;
          break;
        case "Offered":
          return <Badge>{row.original.status}!</Badge>;
        case "Accepted Offer":
          return <Badge>Accepted!</Badge>;
        default:
          return <Badge>{row.original.status}</Badge>;
      }
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    id: "actions",
    header: "See App",
    cell: ({ row }) => <CellAction data={row.original} />
  },
]
