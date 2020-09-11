const fs = require("fs");
const path = require("path");
const markdown = require("markdown-js");

const constants = require("./constants.js");


function delall(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const p = path.join(dir, file);
        if (fs.statSync(p).isFile()){
            fs.unlinkSync(p);
        }
    });
}

function traverseDir(dir, file_fn) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        let curr_path = path.join(dir, file);
        if (fs.lstatSync(curr_path).isFile()) {
            file_fn(curr_path);
        } else {
            traverseDir(curr_path, file_fn);
        }
    });
}

function getPanelDataFromPathWrapper(d) {
    function getPanelDataFromPath(curr_path) {
        if (path.extname(curr_path) != constants.EXT_MD) {
            return;
        }

        const title = path.basename(curr_path, constants.EXT_MD);

        let body = fs.readFileSync(curr_path, constants.ENCODING_UTF8);
        if (!body) {
            body = constants.PLACEHOLDER_TEXT;
        }
        let description = body.substr(0, constants.MAX_PANEL_DESCRIPTION_LENGTH);

        body = markdown.makeHtml(body);
        description = markdown.makeHtml(description);

        d[fs.statSync(curr_path).mtimeMs] = {
            [constants.ATTR_TITLE]: title,
            [constants.ATTR_DESCRIPTION]: description,
            [constants.ATTR_BODY]: body,
        };
    }
    return getPanelDataFromPath
}

function getPanelData() {
    const dir = constants.INPUT_DIR;
    const panelDataRaw = {};

    const getPanelDataFromPathFn = getPanelDataFromPathWrapper(panelDataRaw);
    traverseDir(dir, getPanelDataFromPathFn);

    const times = Object.keys(panelDataRaw);
    times.sort();

    return times.map(t => panelDataRaw[t]);
}

function generateJsonMetadataFiles(panelData) {
    const metadata = panelData.map(panelDatum => {
        return {
            [constants.ATTR_TITLE]: panelDatum[constants.ATTR_TITLE],
            [constants.ATTR_DESCRIPTION]: panelDatum[constants.ATTR_DESCRIPTION],
        };
    });

    const output_path = path.join(constants.OUTPUT_DIR, constants.OUTPUT_PANEL_METADATA);
    const output_str = constants.PANEL_METADATA_VAR + JSON.stringify(metadata) + constants.PANEL_METADATA_EXPORT;
    fs.writeFileSync(output_path, output_str);
}

function generateHtmlFromMarkdownFiles(panelData) {
    const blog_number_length = (panelData.length + "").length;
    panelData.forEach((panelDatum, i) => {
        const panelOutput = {
            [constants.ATTR_TITLE]: panelDatum[constants.ATTR_TITLE],
            [constants.ATTR_BODY]: panelDatum[constants.ATTR_BODY],
        };

        const blog_number = i + "";
        blog_number.padStart(blog_number_length);

        const output_name = constants.BLOG_POST_PREFIX + blog_number + constants.EXT_JS;
        const output_path = path.join(constants.OUTPUT_DIR, output_name);
        const output_str = constants.BLOG_POST_VAR + JSON.stringify(panelOutput) + constants.BLOG_POST_EXPORT;

        fs.writeFileSync(output_path, output_str);
    });
}

delall(constants.OUTPUT_DIR);
const panelData = getPanelData();
generateJsonMetadataFiles(panelData);
generateHtmlFromMarkdownFiles(panelData);
