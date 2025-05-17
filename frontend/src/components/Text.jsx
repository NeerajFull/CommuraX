import { Check, CheckCheck } from "lucide-react";
import { extractLinks } from "../lib/utils";
import Waveform from "./Waveform";


export default function Text({ incoming, author, timestamp, content, type }) {

    const text = extractLinks(content);


    return incoming ? (
        <div className="max-w-lg mr-auto" >
            <p className="mb-2 text-sm font-medium text-blue-50">{author}</p>
            <div className="mb-2 rounded-2xl rounded-tl-none px-5 py-3 bg-stone-600">
                {type === "text" ? <p dangerouslySetInnerHTML={{ __html: text }}></p> : <Waveform />}
            </div>
            <p className="text-xs">{timestamp}</p>
        </div >

    ) : (
        <div className="max-w-lg ml-auto" >
            <div className="mb-2 rounded-2xl rounded-br-none bg-yellow-900 px-5 py-3">
                {type === "text" ? <p className="text-white" dangerouslySetInnerHTML={{ __html: text }}></p> : <Waveform />}
            </div>
            <div className="flex items-center justify-end space-x-2">
                <p className="text-xs">{timestamp}</p>
            </div>
        </div >
    )
}




