export default function getPageNumber(pathname) {
    return parseInt(pathname.split('/').pop());
}
