// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 232, height: 400 })

function getTextStyleFamilies() {
    return [
        ...new Set(
            figma.getLocalTextStyles().map((sty) => sty.fontName.family)
        ),
    ]
}

figma.ui.postMessage({
    type: "text-style-families",
    families: getTextStyleFamilies(),
    styles: figma.getLocalTextStyles().map(({ id, name }) => ({ id, name })),
})

figma.listAvailableFontsAsync().then((fonts) => {
    figma.ui.postMessage({
        type: "available-fonts",
        families: [...new Set(fonts.map(({ fontName }) => fontName.family))],
    })
})

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === "swap-fonts") {
        figma.getLocalTextStyles().map(async (sty) => {
            if (
                sty.fontName.family === msg.originalFamily &&
                msg.forStyles.includes(sty.id)
            ) {
                // TODO: Be smart about switching weights
                // atm assumes the styles are the same
                const fontName = {
                    family: msg.swapFamily,
                    style: sty.fontName.style,
                }

                await figma.loadFontAsync(fontName)
                sty.fontName = fontName
            }
        })
    }

    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin()
}
