class apiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  filter() {
    let queryString = { ...this.queryString };
    const removeFields = ["sort", "page", "limit", "fields", "keyword"];
    removeFields.forEach((e) => delete queryString[e]);

    let queryStringStr = JSON.stringify(queryString);

    queryStringStr = queryStringStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    queryString = JSON.parse(queryStringStr);
    this.mongooseQuery = this.mongooseQuery.find(queryString);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      let query = {};
      if (modelName === "Product") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: "i" } };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  pagination(countDocument) {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    //pagination result;
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.totalPages = Math.ceil(countDocument / limit);
    //next page
    if (page < pagination.totalPages) {
      pagination.next = page + 1;
    }
    //previous page
    if (page > 1) {
      pagination.previous = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginationResult = pagination;
    return this;
  }
}

module.exports = apiFeatures;
