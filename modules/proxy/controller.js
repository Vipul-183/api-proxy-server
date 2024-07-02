const { getCodeforcesBlogData } = require('./helper');

async function getCodeforcesBlog (req, res) {
    try {
        const { blogData } = await getCodeforcesBlogData({ url: req.url, blogEntryId: req.query.blogEntryId});
        return res.status(200).json(blogData);
    } catch (error) {
        const { status = 500, message = 'Internal Server Error' } = error;
        return res.status(status).json({ error: message });
    }
}

module.exports = { getCodeforcesBlog };