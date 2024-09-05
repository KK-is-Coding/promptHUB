import { connectedToDB } from "@utils/database.js";
import Prompt from "@models/prompt.js";



// GET (read)
export const GET = async (req, { params }) => {
    try {
        await connectedToDB();

        const prompt = await Prompt.findById(params.id).populate("creator");
        if (!prompt) {
            return new Response("Prompt not found!", { status: 404 })
        }

        return new Response(JSON.stringify(prompt), { status: 200 });
    }
    catch (error) {
        return new Response("Error finding prompt!", { status: 500 });
    }
}


// PATCH (update)
export const PATCH = async (req, { params }) => {
    const { prompt, tag } = await req.json();

    try {
        await connectedToDB();

        const existingPrompt = await Prompt.findById(params.id).populate("creator");
        if (!existingPrompt) {
            return new Response("Prompt not found!", { status: 404 });
        }

        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();
        return new Response(JSON.stringify(existingPrompt), { status: 200 });
    }
    catch (error) {
        return new Response("Error Updating Prompt!", { status: 500 });
    }
}


// DELETE (delete)
export const DELETE = async (req, { params }) => {
    try {
        await connectedToDB();

        await Prompt.findByIdAndDelete(params.id);

        return new Response("Prompt deleted successfully!", { status: 200 });
    }
    catch (error) {
        return new Response("Error deleting prompt!", { status: 500 });
    }
};