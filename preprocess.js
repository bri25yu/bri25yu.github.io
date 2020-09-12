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
    const formatted_data = {};
    panelData.forEach(panelDatum => {
        formatted_data[panelDatum[constants.ATTR_TITLE]] = panelDatum;
    });
    const output_path = path.join(constants.OUTPUT_DIR, constants.OUTPUT_PANEL_DATA);
    const output_str = constants.PANEL_DATA_VAR + JSON.stringify(formatted_data) + constants.PANEL_DATA_EXPORT;
    fs.writeFileSync(output_path, output_str);
}

delall(constants.OUTPUT_DIR);
const panelData = getPanelData();
generateJsonMetadataFiles(panelData);
