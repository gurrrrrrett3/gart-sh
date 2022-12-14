// type: gsh command

import gshConsole from "../../modules/console";

const bookmarklet = {
    name: 'bookmarklet',
    desc: "View my bookmarklets",
    args: [],
    run: async (self: gshConsole, args: string[]) => {
        const link = '<a href="javascript:(function(){window.location=`https://gart.sh/link?url=${window.location}`})()">Shortlink</a>'
        const qr = '<a href="javascript:(function(){window.location=`https://gart.sh/qr?url=${window.location}`})()">QR Code</a>'
        const fastlinkScript = "javascript:(function(){fetch('https://gart.sh/api/shorten', {method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify({url: window.location})}).then(res => res.json()).then(data => {navigator.clipboard.writeText(data.link);alert(`Copied ${data.link} to clipboard!`)})})()"
        const fastLink = `<a href="${fastlinkScript}">Fastlink</a>`
        return `To add these, right click them and cick "add to bookmarks"<br>${link} | ${qr} | ${fastLink}`
    }
}

export default bookmarklet