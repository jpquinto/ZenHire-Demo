import { IncomingHttpHeaders } from "http";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook, WebhookRequiredHeaders } from "svix";
import axios from "axios";

const webHookSecret = process.env.CLERK_CUSTOMER_UPDATE_WEBHOOK_SECRET || "";
const BACKEND_URL = process.env.BACKEND_URL || "";

type EventType = "user.created" | "user.updated" | "user.deleted" | "*";

type Event = {
    data: {
        id: string;
        first_name: string;
        last_name: string;
    },
    object: "event",
    type: EventType,
};

async function handler(request: Request) {
    const payload = await request.json();
    const headersList = headers();
    const heads = {
        "svix-id": headersList.get("svix-id"),
        "svix-timestamp": headersList.get("svix-timestamp"),
        "svix-signature": headersList.get("svix-signature"),
    }


    const wh = new Webhook(webHookSecret);

    let evt: Event | null = null;
    try {
        evt = wh.verify(
            JSON.stringify(payload), 
            heads as IncomingHttpHeaders & WebhookRequiredHeaders
        ) as Event;
    } catch (err) {
        console.error((err as Error).message);
        return NextResponse.json({}, { status: 400 });
    }

    const eventType: EventType = evt.type;
    if (eventType === "user.created") {
        const {id, first_name, last_name} = evt.data;

        const name = `${first_name} ${last_name}`;
        try {
            await axios.post(`${BACKEND_URL}/users`, {
                externalId: id, 
                name,
            });
        } catch (err) {
            console.error((err as Error).message);
            return NextResponse.json({}, { status: 400 });
        }
    }
    if (eventType === "user.updated") {
        const {id, first_name, last_name} = evt.data;
        const name = `${first_name} ${last_name}`;

        try {
            await axios.patch(`${BACKEND_URL}/user/${id}`, {
                name,
            });
        } catch (err) {
            console.error((err as Error).message);
            return NextResponse.json({}, { status: 400 });
        }
    }    

    return new NextResponse("Success"); // TODO: change later
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;