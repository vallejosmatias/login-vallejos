function auth(req, res, next) {
  if (req.session && req.session.role === "admin") {
    return next();
  } else {
    return res.status(401).send("<p>Debes iniciar sesión como administrador para ver esta página.</p>");
  }
}

export default auth;

