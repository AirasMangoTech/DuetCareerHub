const User = require("../models/User");
const Alumni = require("../models/Alumni");
const Faculty = require("../models/Faculty");

module.exports.paginateData = async (
  model,
  page = 1,
  limit = 10,
  query = {},
  fields = null,
  populateOptions = [],
  noSort = false
) => {
  try {
    const skip = (page - 1) * limit;
    let sortquery = { createdAt: -1 };
    if (noSort) sortquery = {};
    // Start the query with the provided model and query
    let queryBuilder = model
      .find(query)
      .select(fields)
      .sort(sortquery)
      .skip(skip)
      .limit(limit);
    // Apply population if populateOptions are provided
    // populateOptions should look like this:
    // const populateOptions = [
    //   {
    //     path: 'category',  // Reference field
    //     select: 'name description' // Only select the `name` and `description` fields from the `category` collection
    //   }
    // ];

    if (populateOptions?.length > 0) {
      populateOptions?.forEach((option) => {
        queryBuilder = queryBuilder?.populate(option);
      });
    }
    const data = await queryBuilder;
    const totalCount = await model.countDocuments(query);
    const result = {
      status: true,
      data,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit) || 1,
      totalItems: totalCount,
    };
    return result;
  } catch (error) {
    throw new Error("Pagination error: " + error.message);
  }
};

module.exports.userData = async (id, fields) => {
  try {
    let data = await User.findById(id, fields);
    if (!data) data = await Alumni.findById(id, fields);
    if (!data) data = await Faculty.findById(id, fields);
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

module.exports.getAllReceiverIds = async (excludedId) => {
  try {
    const [users, alumni, faculty] = await Promise.all([
      User.find({ email: { $exists: true } }, "_id"),
      Alumni.find({ email: { $exists: true } }, "_id"),
      Faculty.find({ email: { $exists: true } }, "_id"),
    ]);

    const userIds = users.map((doc) => ({
      _id: doc._id.toString(),
      role: "User",
    }));
    const alumniIds = alumni.map((doc) => ({
      _id: doc._id.toString(),
      role: "Alumni",
    }));
    const facultyIds = faculty.map((doc) => ({
      _id: doc._id.toString(),
      role: "Faculty",
    }));

    let allIds = [...userIds, ...alumniIds, ...facultyIds];

    // Only filter if excludedId is provided
    if (excludedId) {
      allIds = allIds.filter((item) => item._id !== excludedId.toString());
    }

    return allIds;
  } catch (error) {
    console.error("Error fetching model IDs with roles:", error);
    return [];
  }
};
