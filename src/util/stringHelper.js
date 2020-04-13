export const removePunct = (text) => {
    return text.replace(/[.,/#!$%^&*;:{}=\-_`~()']/g, "");
};

// getSelection() may return a string with partial words. This ensures that each words are complete.
export const getPayload = (range) => {
    let start = range.startContainer.parentElement;
    let end = range.endContainer.parentElement.nextElementSibling;
    let fullString = [];

    // If <p> is selected by accident, it defaults to next span element.
    if (start.tagName.toLowerCase() !== "span") {
        start = range.startContainer.nextElementSibling;
    }
    while (start !== end && start) {
        fullString.push(start.innerHTML);
        start = start.nextElementSibling;
    }
    return fullString.join(" ");
};