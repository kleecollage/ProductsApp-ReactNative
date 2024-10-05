import { isAxiosError } from "axios";
import { tesloApi } from "../../config/api/tesloApi";
import { Product } from "../../domain/enitities/product";


const prepareImages = ( images: string[] ) => {
  // TODO: revisar los FILES
  return images.map(
    image => image.split('/').pop()
  )
}


export const updateCreateProduct = ( product: Partial<Product> ) => {
  product.stock = isNaN(Number(product.stock)) ? 0 : Number(product.stock);
  product.price = Number(product.price); // puede traer un NAN

  if ( product.id && product.id !== 'new') {
    return updateProduct(product);
  }

  return createProduct(product);
};

// TODO: revisar si viene el usuario
const updateProduct = async ( product: Partial<Product>) => {
  // console.log({product});
  const { id, images = [], ...rest } = product;

  try {    
    const checkImages = prepareImages(images);
    // console.log({checkImages});
  
    const { data } = await tesloApi.patch(`/products/${id}`, {
      images: checkImages,
      ...rest
    })

    return data;

  } catch (error) {
    if ( isAxiosError(error)) {
      console.log(error.response?.data)
    }
    throw new Error(`Error al actualzia el producto`);
  }
};

const createProduct = async (product: Partial<Product>) => {
  const { id, images = [], ...rest } = product;

  try {
      const checkImages = prepareImages(images); 

      const { data } = await tesloApi.post(`/products/`, {
        images: checkImages,
        ...rest
      })
  
      return data;
  } catch (error) {
    if ( isAxiosError(error)) {
      console.log(error.response?.data)
    }
    throw new Error(`Error al actualzia el producto`);
  }
}

