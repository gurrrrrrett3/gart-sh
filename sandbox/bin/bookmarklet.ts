// type: gsh command

import gshConsole from "../../modules/console";

const bookmarklet = {
    name: 'bookmarklet',
    desc: "View my bookmarklets",
    args: [],
    run: async (self: gshConsole, args: string[]) => {
        const link = '<a href="javascript:(function(){window.location=`https://gart.sh/link?url=${window.location}`})()">Shortlink</a>'
        const qr = '<a href="javascript:(function(){window.location=`https://gart.sh/qr?url=${window.location}`})()">QR Code</a>'
        const fastLink = '<a href="javascript:(function(){fetch("https://gart.sh/api/shorten", {method: "POST",headers: {"Content-Type": "application/json"},body: JSON.stringify({url: window.location})}).then(res => res.json()).then(data => {navigator.clipboard.writeText(data.link);alert(`Copied ${data.link} to clipboard!`)})})()">Fastlink</a>'
        return `${link} | ${qr} | ${fastLink}`
    }
}

export default bookmarklet