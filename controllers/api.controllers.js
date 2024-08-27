const { findApi } = require("../models/api.models");

const getApi = (req, res) => {
  findApi().then((response) => {
    res.status(200).send(response);
  });
};

module.exports = { getApi };
