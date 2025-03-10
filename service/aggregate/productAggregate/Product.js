const { relativeTimeThreshold } = require("moment");
const { ObjectId } = require("mongodb");

module.exports = class Product {
    constructor({
        name,
        quantity,
        unitPrice,
        description = null,
        brandId,
        categoryIds = [],
        isEnable = true,
        isDeleted = false,
        createdAt = new Date(),
        createdBy = new ObjectId("000000000000000000000000"),
        modifiedAt = new Date(),
        modifiedBy = new ObjectId("000000000000000000000000"),
        _id,
    }) {
        this.name = name;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.description = description;
        this.brandId = brandId;
        this.categoryIds = categoryIds;
        this.isEnable = isEnable;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.modifiedAt = modifiedAt;
        this.modifiedBy = modifiedBy;
        this._id = _id;
    }

    getId() {
        return this._id?.toString();
    }

    getBrandId() {
        return this.brandId?.toString();
    }

    getCategoryIds() {
        return this.categoryIds.length ? this.categoryIds.map(r => r.toString()) : [];
    }
}