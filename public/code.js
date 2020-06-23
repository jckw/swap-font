'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

// This plugin will open a modal to prompt the user to enter a number, and
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 232, height: 400 });
function getTextStyleFamilies() {
    return [
        ...new Set(figma.getLocalTextStyles().map((sty) => sty.fontName.family)),
    ];
}
figma.ui.postMessage({
    type: "text-style-families",
    families: getTextStyleFamilies(),
    styles: figma.getLocalTextStyles().map(({ id, name }) => ({ id, name })),
});
figma.listAvailableFontsAsync().then((fonts) => {
    figma.ui.postMessage({
        type: "available-fonts",
        families: [...new Set(fonts.map(({ fontName }) => fontName.family))],
    });
});
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === "swap-fonts") {
        figma.getLocalTextStyles().map((sty) => __awaiter(void 0, void 0, void 0, function* () {
            if (sty.fontName.family === msg.originalFamily &&
                msg.forStyles.includes(sty.id)) {
                // TODO: Be smart about switching weights
                // atm assumes the styles are the same
                const fontName = {
                    family: msg.swapFamily,
                    style: sty.fontName.style,
                };
                yield figma.loadFontAsync(fontName);
                sty.fontName = fontName;
            }
        }));
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
};
