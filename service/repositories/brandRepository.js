const { ObjectId } = require('mongodb');
const { Brand } = require("../aggregate");
const followTypeEnum = require("../enum/followType");

module.exports = ({
    collections: {
        brands,
        follows,
    }
}) => {
    return {
        async get(brandId) {
            try {
                const result = await brands.findOne({
                    _id: new ObjectId(brandId),
                    isEnable: true,
                    isDeleted: false
                });

                return [null, result ? new Brand(result) : null];

            } catch (error) {
                return [error];
            }
        },

        async getAll({ search }) {
            let query = {
                isEnable: true,
                isDeleted: false
            };

            if (search) {
                query.name = { $regex: '^' + search, $options: 'i' }
            }

            try {
                const result = await brands.find(query);

                return [null, result ? new Brand(result) : null];

            } catch (error) {
                return [error];
            }
        },

        async getUserFollowed(userId) {
            try {
                const result = await follows.aggregate([
                    {
                        $match: {
                            userId: new ObjectId(userId),
                            type: followTypeEnum.BRAND,
                            isDeleted: false
                        }
                    },
                    {
                        $lookup: {
                            from: brands.collectionName,
                            let: { brandId: "$referenceId" },
                            as: "brands",
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$brandId", "$_id"] },
                                        isEnable: true,
                                        isDeleted: false
                                    }
                                },
                            ]
                        }
                    },
                    { $match: { "brands.0": { $exists: true } } },
                    { $unwind: "$brands" },
                    { $replaceRoot: { newRoot: "brands" } }
                ]).toArray();

                return [null, result.length ? result.map(r => new Brand(r)) : null];

            } catch (error) {
                return [error];
            }
        }
    }
}