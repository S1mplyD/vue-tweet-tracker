function convertFilter(filter){

    let query = "";
    if( filter ) {
        if( filter.words ) {
            if( filter.words.all ) {
                query += ` ${ filter.words.all.join( " " )}`;
            }
            if( filter.words.exact ) {
                query += ` "${filter.words.exact.join( " " )}"`;
            }
            if( filter.words.any ) {
                query += ` ${ filter.words.any.join( " OR " )}`;
            }
            if( filter.words.none ) {
                query += ` -${filter.words.none.join( " -" )}`;
            }

            if( filter.words.hashtags ) {
                filter.words.hashtags.forEach( (item, key, array) => array[ key ] = item.replace(/#/g, "") )
                query += ` #${filter.words.hashtags.join( " #" )}`;
            }

            if( filter.words.language ) {
                query += ` lang:${ filter.words.language }`;
            }
        }

        if( filter.accounts ) {
            if( filter.accounts.from ) {
                filter.accounts.from.forEach( (item, key, array) => array[ key ] = item.replace(/@/g, "") )
                query += ` from:${filter.accounts.from.join( " from:")}`;
            }
            if( filter.accounts.to ) {
                filter.accounts.to.forEach( (item, key, array) => array[ key ] = item.replace(/@/g, "") )
                query += ` to:${filter.accounts.to.join( " to:")}`;
            }
            if( filter.accounts.mentioning ) {
                filter.accounts.mentioning.forEach( (item, key, array) => array[ key ] = item.replace(/@/g, "") )
                query += ` @${filter.accounts.mentioning.join( " @")}`;
            }
        }

        if( filter.dates ) {
            if( filter.dates.from || filter.dates.since ) {
                query += ` since:${ filter.dates.from || filter.dates.since }`;
            }
            if( filter.dates.to || filter.dates.until ) {
                query += ` until:${ filter.dates.to || filter.dates.until }`;
            }
        }

        if( filter.filters ) {
            if( filter.filters.links ) {
                query += ` filter:links`;
            }
            if( filter.filters.linksValue ) {
                query += ` url:${filter.filters.linksValue}`;
            }
        }

        query = query.trim();
    }
    return query;
}

module.exports.convertfilter = convertFilter;