export default function useURLParams(search) {
    const params = new Map();
    if (search) {
        const urlSearchParams = search.split('?')[1].split('&');
        for (const param of urlSearchParams) {
            params.set(param.split('=')[0], param.split('=')[1]);
        }
    }

    return params;
}
