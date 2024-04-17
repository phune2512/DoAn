var express = require("express");
var router = express.Router();
var side_itemModel = require("../schemas/side_item");
require("express-async-errors");

router.get("/", async function (req, res, next) {
  let limit = req.query.limit ? req.query.limit : 4;
  let page = req.query.page ? req.query.page : 1;
  var queries = {};
  var exclude = ["sort", "page", "limit"];
  var stringFilter = ["name"];
  var numberFilter = ["soluong"];

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
  side_items = await side_itemModel
    .find(queries)
    .lean()
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();
  res.status(200).send(side_items);
});
router.get("/:id", async function (req, res, next) {
  var side_item = await side_itemModel.findById(req.params.id).exec();
  res.status(200).send(side_item);
});

router.post("/", async function (req, res, next) {
  try {
    let newSide_item = new side_itemModel({
      name: req.body.name,
      soluong: req.body.soluong,
    });
    await newSide_item.save();
    res.status(200).send(newSide_item);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    var side_item = await side_itemModel
      .findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
      .exec();
    res.status(200).send(side_item);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    var side_item = await side_itemModel
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
    res.status(200).send(side_item);
  } catch (error) {
    res.status(404).send(error);
  }
});
module.exports = router;
