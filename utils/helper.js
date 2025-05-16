module.exports.paginateData = async (
  model,
  page = 1,
  limit = 10,
  query = {},
  fields = null,
  populateOptions = [],
  noSort=false
) => {
  try {
    const skip = (page - 1) * limit;
    let sortquery = { createdAt: -1 }
    if(noSort) sortquery = {}
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
