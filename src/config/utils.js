export function scrollIntoViewWithOffset(elementId, offset) {
    const element = document.getElementById(elementId);
    if (element) {
        const headerOffset = offset;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}


export const lockBodyScroll = () => {
    document.getElementsByTagName("body")[0].className += " overflow-hidden"
}

export const unlockBodyScroll = () => {
    document.getElementsByTagName("body")[0].className = document.getElementsByTagName("body")[0].className.replace("overflow-hidden", "");
}

export const getCompressedImgUrl = (url, width=500, height=500) => {
    try {
        url = url.replaceAll("https://pikky.s3.amazonaws.com/", "");
        url = url.replaceAll("https://df9pza7vwlyb8.cloudfront.net", "cuisines")
        const payload = {
            "bucket": "pikky",
            "key": decodeURIComponent(url),
            "edits": {
                "resize": {
                    "width": width,
                    "height": height,
                    "fit": "cover"
                }
            }
        }
        return "https://d3u6zo5p9bbz8x.cloudfront.net/" + btoa(JSON.stringify(payload))
    } catch (e) {
        return getCompressedImgUrl("https://pikky.s3.amazonaws.com/patterns/Property 1=Checkers, Type=1.png")
    }
}