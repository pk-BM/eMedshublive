import { sendResponse } from "../utils/sendResponse.js";
import Pharmaceutical from "../models/pharmaceutical.model.js";
import Brand from "../models/brand.model.js";
import Generic from "../models/generic.model.js";

export const SearchResults = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === "") {
            return sendResponse(res, 400, false, "Search term is required");
        }

        const searchRegex = new RegExp(query, "i");

        // Run all 3 searches in parallel
        const [pharmaceuticals, brands, generics] = await Promise.all([
            Pharmaceutical.find({ Name: searchRegex }).select("_id Name").limit(10),
            Brand.find({ name: searchRegex }).select("_id name").limit(10),
            Generic.find({ name: searchRegex }).select("_id name").limit(10),
        ]);

        // Normalize and combine all results
        const allResults = [
            ...pharmaceuticals.map(item => ({
                _id: item._id,
                name: item.Name,
                apiPath: `/pharmaceuticals/${item._id}`,
                type: "Pharmaceutical",
            })),
            ...brands.map(item => ({
                _id: item._id,
                name: item.name,
                apiPath: `/brands/${item._id}`,
                type: "Brand",
            })),
            ...generics.map(item => ({
                _id: item._id,
                name: item.name,
                apiPath: `/generics/${item._id}`,
                type: "Generic",
            })),
        ];

        // Rank results by how closely the name matches the search term
        const rankedResults = allResults.sort((a, b) => {
            const aIndex = a.name.toLowerCase().indexOf(query.toLowerCase());
            const bIndex = b.name.toLowerCase().indexOf(query.toLowerCase());

            // Exact starts-with matches come first
            if (aIndex === 0 && bIndex !== 0) return -1;
            if (bIndex === 0 && aIndex !== 0) return 1;

            // Then shorter distance to match
            if (aIndex !== bIndex) return aIndex - bIndex;

            // Finally, alphabetically
            return a.name.localeCompare(b.name);
        });

        return sendResponse(res, 200, true, "Search results fetched successfully", rankedResults);
    } catch (error) {
        console.error("Error in SearchResults:", error);
        return sendResponse(
            res,
            500,
            false,
            error.message || "Internal Server Error"
        );
    }
};
