class BoilerplateGetHandler {
  public route(req, res) {
    const { method, url } = req;

    console.log(`${method} ${url}`);

    return res.json({
      boilerplate: 'boilerplate',
    });
  }

}

export default new BoilerplateGetHandler();
