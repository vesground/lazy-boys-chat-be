import Services from 'lib/api/services';

export default function(req, res, next) {
  // console.log('req keys', Object.keys(req));
  // console.log('req.params', req.route.path);

  const path = req.route.path;
  const method = req.method;
  const service = Services[path][method];

  service(req, res, next).catch(next);
}
