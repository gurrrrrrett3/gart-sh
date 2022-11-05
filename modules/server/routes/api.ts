import { Router } from 'express';
import ShortLinkManager from '../../links';
const router = Router();

router.post('/shorten', async (req, res) => {

    const url = req.body.url;

    if (!url) {
        res.status(400).json({ error: 'No URL provided' });
        return;
    }

    res.json({ link: `https://gart.sh/${await ShortLinkManager.createLink(url)}` });

});

export default router;