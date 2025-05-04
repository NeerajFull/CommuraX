export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);




export function extractLinks(text) {
    const regex = /https?:\/\/[^\s]+/g;
    const matches = text.match(regex);

    if (matches && matches.length > 0) {
        const linkFormat = `<span class="underline"><a href="${matches[0]}" target="_blank">${matches[0]}</a> </span>`
        text = text.replace(matches[0], linkFormat);
        return text;
    }
    return text;
}


export function formatMongoTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
  
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
  
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12 || 12;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}${ampm}`;
  
    if (isToday) {
      return formattedTime;
    } else {
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleString('default', { month: 'short' }); // e.g., Jan, Feb
      return `${day} ${month}, ${formattedTime}`;
    }
  }
  