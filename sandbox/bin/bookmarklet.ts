// type: gsh command

import gshConsole from "../../modules/console";

const bookmarklet = {
    name: 'bookmarklet',
    desc: "View my bookmarklets",
    args: [],
    run: async (self: gshConsole, args: string[]) => {
        const link = '<a href="javascript:(function(){window.location=`https://gart.sh/link?url=${window.location}`})()">Shortlink</a>'
        return link;
    }
}

export default bookmarklet