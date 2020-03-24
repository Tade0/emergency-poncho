const url = require('url');

module.exports.parseHar = function(har) {
  const {entries} = har.log;
  const result = {};

  entries.forEach(entry => {
    const {pathname, search} = url.parse(entry.request.url);

    const key = pathname;

    if (!result[key]) {
      result[key] = {
        GET: [],
        POST: [],
        PUT: [],
        DELETE: []
      };
    }

    result[key][entry.request.method].push({
      ...entry,
      search: search ? search : ''
    });
  });

  return result;
}
