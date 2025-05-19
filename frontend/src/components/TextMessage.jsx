import { extractLinks } from "../lib/utils";

const TextMessage = ({ text, classes }) => {

    let textContent = extractLinks(text);

    return <p dangerouslySetInnerHTML={{ __html: textContent }} className={classes}></p>

}

export default TextMessage;