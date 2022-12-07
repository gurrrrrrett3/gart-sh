import { Router } from 'express';
import BannerGen from '../../imageGen/bannerGen';
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

router.get("/banner", async (req, res) => {

    const banner = await BannerGen.genBanner()

    res.setHeader('Content-Type', 'image/webp');
    res.setHeader("cache-control", "no-cache, no-store, must-revalidate");
    res.setHeader("pragma", "no-cache");
    res.setHeader("expires", "0");

    res.send(banner);
});

export default router;