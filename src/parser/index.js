const url = require('url');

module.exports.parseHar = function(har) {
  const {entries} = har.log;
  const result = {};

  entries.forEach(entry => {
    const {pathname} = url.parse(entry.request.url);

    if (!result[pathname]) {
      result[pathname] = {
        GET: [],
        POST: [],
        PUT: [],
        DELETE: []
      };
    }

    result[pathname][entry.request.method].push(entry);
  });

  return result;
}
