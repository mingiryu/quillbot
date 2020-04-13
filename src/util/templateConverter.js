import { removePunct } from "./stringHelper"

export const convertDocument = () => {
    [...document.getElementsByTagName("p")].forEach((p) => {
        p.outerHTML = `<p class="article-paragraph">${p.innerHTML
            .split(" ")
            .map((word) => `<span>${word}</span>`)
            .join(" ")}</p>`;
    });
}

export const updateView = (json, range) => {
    let start = range.startContainer.parentElement;
    let end = range.endContainer.parentElement.nextElementSibling;

    // If div:article-paragraph is selected by accident, it defaults to next span element.
    if (start.tagName.toLowerCase() !== "span") {
        start = range.startContainer.nextElementSibling;
    }

    json.forEach((data) => {
        const orig = data.original;
        const pps = data.paraphrases[0];
        const segs = pps.segs;

        for (let i = 0; i < segs.length; i++) {
            const seg = segs[i];

            if (start) {
                // Check for punctuation
                if (i < segs.length - 1) {
                    const nextSeg = segs[i + 1].text;
                    const hasPunct = removePunct(nextSeg) === "";
                    var punct = hasPunct ? nextSeg : "";
                    if (hasPunct) i++;
                }

                // Set attributes and properties according to each seg
                if (orig.toLowerCase().includes(seg.text.toLowerCase())) {
                    if (seg.alts.length) {
                        start.setAttribute("class", "article-unchanged");
                    }
                } else {
                    start.setAttribute("class", "article-word");
                }
                start.innerHTML = `${seg.text}${punct}`;
                start.alts = seg.alts.map((a) => a.text);

                start = start.nextElementSibling;
            }
        }
    });

    // Empty unused ranges
    while (start !== end && start) {
        start.innerHTML = "";
        start = start.nextElementSibling;
    }
    // Clear selection
    window.getSelection().empty();
};