import { Check, CheckCheck } from "lucide-react";
import { extractLinks } from "../lib/utils";


export default function Text({ incoming, author, timestamp, content }) {

    const text = extractLinks(content);


    return incoming ? (
        <div className="max-w-lg" >
            <p className="mb-2 text-sm font-medium text-blue-50">{author}</p>
            <div className="mb-2 rounded-2xl rounded-tl-none px-5 py-3 bg-stone-600">
                <p dangerouslySetInnerHTML={{ __html: text }}></p>
            </div>
            <p className="text-xs">{timestamp}</p>
        </div >

    ) : (
        <div className="max-w-lg ml-auto" >
            <div className="mb-2 rounded-2xl rounded-br-none bg-yellow-900 px-5 py-3">
                <p className="text-white" dangerouslySetInnerHTML={{ __html: text }}></p>
            </div>
            <div className="flex items-center justify-end space-x-2">
                {/* <div className={`${read_receipt === "read" ? "text-primary" : "dark:text-white"}`}>
                    {<CheckCheck /> : <Check />}
                </div> */}
                <p className="text-xs">{timestamp}</p>
            </div>
        </div >
    )
}




