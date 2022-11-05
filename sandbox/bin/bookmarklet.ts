// type: gsh command

import gshConsole from "../../modules/console";

const bookmarklet = {
    name: 'bookmarklet',
    desc: "View my bookmarklets",
    args: [],
    run: async (self: gshConsole, args: string[]) => {
        const link = '<a href="javascript:(function(){window.location=`https://gart.sh/link?url=${window.location}`})()">Shortlink</a>'
        const qr = '<a href="javascript:(function(){window.location=`https://gart.sh/qr?url=${window.location}`})()">QR Code</a>'
        return `${link} | ${qr}`
    }
}

export default bookmarklet