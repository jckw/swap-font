// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 232, height: 208 });
function getTextStyleFamilies() {
    return [
        ...new Set(figma.getLocalTextStyles().map((sty) => sty.fontName.family)),
    ];
}
figma.ui.postMessage({
    type: "text-style-families",
    families: getTextStyleFamilies(),
    xyz: figma.getLocalTextStyles(),
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
        figma.getLocalTextStyles().map((sty) => __awaiter(this, void 0, void 0, function* () {
            if (sty.fontName.family === msg.originalFamily) {
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
