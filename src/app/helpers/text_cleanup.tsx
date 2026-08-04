export function textEncoding(text : string) {

     
    
     // this converts any spaces to '%20'
        // var no_symbols = escapeHtml(text)
        var spacer = encodeURIComponent(text)
    
        return (spacer)
    }


export function textEscapes(text : string) {
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '\"',
        "'": "\'",
        "/": '&sol;',
        "#": '%23;'
    };
    
    // this cleans up symbols
     function escapeHtml(string) {
        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    }

    var no_symbols = JSON.stringify(escapeHtml(text))

    return (no_symbols)
}