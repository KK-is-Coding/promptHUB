import { connectedToDB } from "@utils/database.js";
import Prompt from "@models/prompt.js";


export const GET = async (req, { params }) => {
    try {
        await connectedToDB();

        const prompts = await Prompt.find({
            creator: params.id
        }).populate("creator");

        return new Response(JSON.stringify(prompts), { status: 200 });
    }
    catch (error) {
        return new Response("Failed to fetch prompts created by user", { status: 500 });
    }
}