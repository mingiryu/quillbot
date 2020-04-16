export const removePunct = (text) => {
    return text.replace(/[.,/#!$%^&*;:{}=\-_`~()']/g, "");
};

// getSelection() may return a string with partial words. This ensures that each words are complete.
export const getPayload = (range) => {
    let start = range.startContainer.parentElement;
    let end = range.endContainer.parentElement.nextElementSibling;
    let fullString = [];

    if (range.startContainer.wholeText === ' ') {
        start = range.startContainer.nextElementSibling
    }
    if (range.endContainer.wholeText === ' ') {
        end = range.endContainer.nextElementSibling
    }

    while (start !== end && start) {
        fullString.push(start.innerHTML);
        start = start.nextElementSibling;
    }
    return fullString.join(" ");
};