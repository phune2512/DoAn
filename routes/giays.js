var express = require("express");
var router = express.Router();
var giayModel = require("../schemas/giay");
require("express-async-errors");

router.get("/", async function (req, res, next) {
  let limit = req.query.limit ? req.query.limit : 4;
  let page = req.query.page ? req.query.page : 1;
  var queries = {};
  var exclude = ["sort", "page", "limit"];
  var stringFilter = ["name", "author"];
  var numberFilter = ["size"];
  //{ page: '1', limit: '5', name: 'Hac,Ly', author: 'Cao' }
  for (const [key, value] of Object.entries(req.query)) {
    if (!exclude.includes(key)) {
      if (stringFilter.includes(key)) {
        queries[key] = new RegExp(value.replace(",", "|"), "i");
      } else {
        if (numberFilter.includes(key)) {
          let string = JSON.stringify(value);
          let index = string.search(new RegExp("lte|gte|lt|gt", "i"));
          if (index < 0) {
            queries[key] = value;
          } else {
            queries[key] = JSON.parse(
              string.slice(0, index) + "$" + string.slice(2, string.length)
            );
          }
        }
      }
    }
  }
  console.log(queries);
  queries.isDeleted = false;
  giays = await giayModel
    .find(queries)
    .populate({ path: "author", select: "_id name" })
    .lean()
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();
  res.status(200).send(giays);
});
router.get("/:id", async function (req, res, next) {
  var giay = await giayModel.findById(req.params.id).exec();
  res.status(200).send(giay);
});

router.post("/", async function (req, res, next) {
  try {
    let newGiay = new giayModel({
      name: req.body.name,
      size: req.body.size,
      author: req.body.author,
    });
    await newGiay.save();
    res.status(200).send(newGiay);
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
