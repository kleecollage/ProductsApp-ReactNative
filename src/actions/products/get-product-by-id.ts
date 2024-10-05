import { tesloApi } from "../../config/api/tesloApi"
import { Gender, Product } from "../../domain/enitities/product"
import { TesloProduct } from "../../infrastructure/interfaces/teslo-products.response"
import { ProductMapper } from "../../infrastructure/mappers/product.mappers";

const emptyProduct: Product = {
  id: '',
  title: 'Nuevo Producto',
  description: '',
  images: [],
  stock: 0,
  price: 0,
  sizes: [],
  slug: '',
  tags: [],
  gender: Gender.Unisex
}

export const getProductById = async (id: string): Promise<Product> => {

  if (id === 'new') return emptyProduct;
  
  try {
    const { data } = await tesloApi.get<TesloProduct>(`/products/${id}`);
    return  ProductMapper.tesloProductToEntity(data)
  } catch (error) {
    console.log(error)
    throw new Error(`Error getting product by id: ${id}`);
  }
}