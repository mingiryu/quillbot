import { removePunct } from "./stringHelper"

export const convertDocument = () => {
    [...document.getElementsByTagName("p")].forEach((p) => {
        p.outerHTML = `<p class="article-paragraph">${p.innerHTML
            .split(" ")
            .map((word) => `<span>${word}</span>`)
            .join(" ")}</p>`;
    });
}

export const createView = (json, range) => {
    let p = document.createElement("p")
    p.setAttribute("class", "article-rephrased")
    json.forEach((data) => {
        const orig = data.original;
        const pps = data.paraphrases[0];
        const segs = pps.segs;

        for (let i = 0; i < segs.length; i++) {
            const seg = segs[i];

            // Check for punctuation
            if (i < segs.length - 1) {
                const nextSeg = segs[i + 1].text;
                const hasPunct = removePunct(nextSeg) === "";
                var punct = hasPunct ? nextSeg : "";
                if (hasPunct) i++;
            }

            let span = document.createElement("span")
            // Set attributes and properties according to each seg
            if (orig.toLowerCase().includes(seg.text.toLowerCase())) {
                if (seg.alts.length) {
                    span.setAttribute("class", "article-unchanged");
                } else {
                    span.setAttribute("class", "article-nooptions");
                }
            } else {
                span.setAttribute("class", "article-changed");
            }

            span.innerHTML = `<span class="article-new">${seg.text}${punct}</span> `;
            span.alts = seg.alts.map((a) => a.text);
            p.appendChild(span)
        }
    })

    let start = range.startContainer.parentElement;
    let end = range.endContainer.parentElement.nextElementSibling;

    if (range.startContainer.wholeText === ' ') {
        start = range.startContainer.nextElementSibling
    }
    if (range.endContainer.wholeText === ' ') {
        end = range.endContainer.nextElementSibling
    }

    // highlight processed text.
    while (start !== end && start) {
        start.setAttribute("class", "article-original")
        start = start.nextElementSibling;
    }

    // p must be append after range process is done.
    if (range.startContainer.wholeText === ' ') {
        range.startContainer.nextElementSibling.parentElement.appendChild(p)
    } else {
        range.startContainer.parentElement.parentElement.appendChild(p)
    }

    // Clear selection
    window.getSelection().empty();
}