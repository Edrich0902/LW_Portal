export const formatSearchText = (searchText: string, and = false) => {
    let split = searchText.split(' ');
    let quotedParts = split.map(part => `'${part.trim()}'`);

    if (and) return quotedParts.join(' & ')
    else return quotedParts.join(' | ')
}