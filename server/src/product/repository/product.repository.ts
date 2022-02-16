import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../model/product.model';
import {
  ProductImage,
  ProductImageSchema,
} from '../../product-image/model/product-image.model';
import { CreateProductDto } from '../dto/create.product.dto';
import * as mongoose from 'mongoose';
import { UserSchema } from '../../user/model/user.model';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name) private readonly product: Model<Product>,
    @InjectModel(ProductImage.name)
    private readonly productImage: Model<ProductImage>,
  ) {}

  async findByIdAndPopulate(id: string): Promise<Product> {
    const ProductImageModel = mongoose.model(
      'productimages',
      ProductImageSchema,
    );

    const UserModel = mongoose.model('users', UserSchema);

    const result = await this.product
      .findById(id)
      .populate('productImgURLs', ProductImageModel)
      .populate('userInfo', UserModel);

    console.log('result >> ', result);
    return result;
  }

  async getAllProduct() {
    return this.product.find();
  }

  // 상품 정보 저장
  async uploadProduct(
    currentUser,
    productInfo: CreateProductDto,
  ): Promise<Product> {
    const userId = currentUser._id;
    const result = await this.product.create({
      userId,
      ...productInfo,
    });

    return result._id;
  }

  // 상품 이미지 경로 저장
  async uploadProductImage(productId, files): Promise<boolean> {
    try {
      // 첫번째 상품 이미지는 상품 썸네일 이미지로 지정
      if (files && files[0]) {
        const product = await this.product.findById(productId);
        product.thumbnailImgURL = `${process.env.MEDIA_URL}/static/product_image/${files[0].filename}`;
        await product.save();
      }

      for (const file of files) {
        const productImgURL = `${process.env.MEDIA_URL}/static/product_image/${file.filename}`;
        await this.productImage.create({
          productId,
          productImgURL,
        });
      }
      return true;
    } catch (err) {
      return false;
    }
  }
}