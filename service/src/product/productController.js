const { createController } = require("awilix-express");
const { generateSuccessResponse, generateErrorResponse } = require("../../utils/responseParser");
const errorMessages = require("../../errorMessages");
const followTypeEnum = require("../../enum/followType");

const controller = ({
    config,
    productRepository,
    wishlistRepository
}) => {
    
    return {
        async getProducts(req, res) {
            try {
                let {
                    search,
                    categoryIds = [],
                    brandIds = [],
                    shopIds = [],
                    isFollowedBrand,
                    isFollowedShop,
                    isWishlist
                } = req.body;

                const user = req.httpContext?.user;

                if ((isFollowedBrand === true || isFollowedShop === true || isWishlist === true) && !user)
                    return res.status(403).send(generateErrorResponse(errorMessages.forbidden()));

                const userId = user.id;

                if (isFollowedBrand === true) {
                    const [followedBrandsError, followedBrands] = await followRepository.getAll({
                        userId,
                        type: followTypeEnum.BRAND
                    });

                    if (followedBrandsError)
                        throw followedBrandsError;

                    if (followedBrands) {
                        brandIds = [...new Set(brandIds.concat(followedBrands.map(r => r.getReferenceId())))];
                    }
                }

                if (isFollowedShop === true) {
                    const [followedShopsError, followedShops] = await followRepository.getAll({
                        userId,
                        type: followTypeEnum.SHOP
                    });

                    if (followedShopsError)
                        throw followedShopsError;

                    if (followedShops) {
                        shopIds = [...new Set(shopIds.concat(followedShops.map(r => r.getReferenceId())))];
                    }
                }

                let productIds = [];

                if (isWishlist === true) {
                    const [wishlistsError, wishlists] = await wishlistRepository.getAll(userId);

                    if (wishlistsError)
                        throw wishlistsError;

                    if (wishlists) {
                        productIds.concat(wishlists.map(r => r.getProductId()));
                    }
                }

                const [productsError, products] = await productRepository.getAll({
                    search,
                    productIds,
                    categoryIds,
                    brandIds,
                    shopIds,
                    isWishlist
                });

                if (productsError)
                    throw productsError;

                let response = products ? products.map(r => {
                    return {
                        productId: r.getId(),
                        name: r.name,
                        description: r.description,
                        unitPrice: parseFloat(r.unitPrice),
                        quantity: r.quantity,
                        brandId: r.getBrandId(),
                        categoryIds: r.getCategoryIds()
                    }
                }) : [];

                return res.status(200).send(generateSuccessResponse(response));

            } catch (error) {
                console.log(err);
                return res.status(500).send(generateErrorResponse());
            }
        }
    }
}

module.exports = createController(controller)
    .prefix("/api")
    .post("/users/products", "getProducts")