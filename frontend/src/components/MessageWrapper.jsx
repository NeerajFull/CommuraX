import PhotoMessage from "./PhotoMessage";
import TextMessage from "./TextMessage";
import Waveform from "./Waveform";


export default function MessageWrapper({ incoming, author, timestamp, content, type }) {

    return incoming ? (
        <div className="max-w-lg mr-auto" >
            <p className="mb-2 text-sm font-medium text-blue-50">{author}</p>
            <div className="mb-2 rounded-2xl rounded-tl-none px-5 py-3 bg-stone-600">
                {type === "text" && <TextMessage text={content} />}
                {type === "audio" && <Waveform audioUrl={content} />}
                {type === "photo" && <PhotoMessage classes="rounded-2xl rounded-tl-none" photoUrl={content} />}
            </div>
            <p className="text-xs">{timestamp}</p>
        </div >

    ) : (
        <div className="max-w-lg ml-auto" >
            <div className="mb-2 rounded-2xl rounded-br-none bg-yellow-900 px-5 py-3">
                {type === "text" && <TextMessage text={content} classes="text-white" />}
                {type === "audio" && <Waveform audioUrl={content} />}
                {type === "photo" && <PhotoMessage classes="rounded-2xl rounded-br-none" photoUrl={content} />}
            </div>
            <div className="flex items-center justify-end space-x-2">
                <p className="text-xs">{timestamp}</p>
            </div>
        </div >
    )
}




