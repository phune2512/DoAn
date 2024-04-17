var express = require("express");
var router = express.Router();
var authorModel = require("../schemas/author");

router.get("/", async function (req, res, next) {
  var authors = await authorModel.find({}).populate("published").exec();
  res.status(200).send(authors);
});

router.get("/:id", async function (req, res, next) {
  try {
    var giay = await giayModel.findById(req.params.id).exec();
    res.status(200).send(giay);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.post("/", async function (req, res, next) {
  try {
    let newAuthor = new authorModel({
      name: req.body.name,
    });
    await newAuthor.save();
    res.status(200).send(newAuthor);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    var giay = await giayModel
      .findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
      .exec();
    res.status(200).send(giay);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    var giay = await giayModel
      .findByIdAndUpdate(
        req.params.id,
        {
          isDeleted: true,
        },
        {
          new: true,
        }
      )
      .exec();
    res.status(200).send(giay);
  } catch (error) {
    res.status(404).send(error);
  }
});
module.exports = router;
