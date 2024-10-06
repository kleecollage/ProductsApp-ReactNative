import { useRef } from 'react';
import { Formik } from 'formik';
import { StackScreenProps } from '@react-navigation/stack';
import { Button, ButtonGroup, Input, Layout, Text, useTheme } from '@ui-kitten/components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MainLayout } from '../../layouts/MainLayout'
import { RootStackParams } from '../../navigation/StackNavigator';
import { ScrollView } from 'react-native-gesture-handler';
import { Product } from '../../../domain/enitities/product';
import { MyIcon } from '../../components/ui/MyIcon';
import { updateCreateProduct, getProductById } from '../../../actions/products';
import { ProductImages } from '../../components/products/ProductImages';
import { genders, sizes } from '../../../config/constants/constants';
import { CameraAdapter } from '../../../config/adapters/camera-adapter';

interface Props extends StackScreenProps<RootStackParams, 'ProductScreen'> {}


export const ProductScreen = ( { route }: Props) => {  
  const theme = useTheme();
  const queryClient = useQueryClient();
  // cuando actualizamos cambiamos el ID, por eso el useRef
  const productIdRef = useRef(route.params.productId)
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productIdRef.current ],
    queryFn: () => getProductById(productIdRef.current)
  });
  
  const mutation = useMutation({
    // data = Product
    mutationFn: ( data:Product ) => updateCreateProduct({...data, id: productIdRef.current}),
    onSuccess( data: Product ) {
      productIdRef.current = data.id; // para la creacion
      queryClient.invalidateQueries({ queryKey: ['products', 'infinite'] });  // se vuelve a cargar la data
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      // queryClient.setQueryData(['product', data.id], data); // de esta forma las imagenes vienen sin el url
      console.log('Succes');
      // console.log({data});
    }
  })
  
  if( !product ){
    return <MainLayout title='Cargando' />
  }


  return (
    <Formik
      initialValues={ product }
      onSubmit={  mutation.mutate }
    >

      { ({ handleChange, handleSubmit, values, errors, setFieldValue }) => (
        <MainLayout
          title={values.title}
          subtitle={`Precio: ${values.price} USD`}
          rightAction={ async() => {
            const photos = await CameraAdapter.getPicturesFromLibrary();
            setFieldValue('images', [...values.images, ...photos])
          }}
          rightActionIcon='image-outline'
        >
          <ScrollView>
            {/* IMAGENES DEL PRODUCTO */}
            <Layout style={{ marginVertical: 10, justifyContent:'center', alignItems:'center'}}>
              <ProductImages images={values.images} />
            </Layout>
            {/* FORMULARIO */}
            <Layout style={{ marginHorizontal: 10 }}>
              <Input
                style={{ marginVertical: 5 }}
                label='Titulo'
                value={ values.title }
                onChangeText={ handleChange('title') }
              />
              
              <Input
                style={{ marginVertical: 5 }}
                label='Slug'
                value={ values.slug }
                onChangeText={ handleChange('slug') }
              />

              <Input
                style={{ marginVertical: 5 }}
                label='Descripcion'
                multiline
                numberOfLines={5}
                value={ values.description }
                onChangeText={ handleChange('description') }
              />
            </Layout>
            {/* PRECIO | INVENTARIO */}
            <Layout style={{ marginHorizontal: 15, flexDirection: 'row', gap: 10 }}>
              <Input
                style={{ marginVertical: 5, flex: 1 }}
                label='Precio'
                value={ values.price.toString() }
                onChangeText={ handleChange('price') }
                keyboardType='number-pad'
              />

              <Input
                style={{ marginVertical: 5, flex: 1 }}
                label='Inventario'
                value={ values.stock.toString() }
                onChangeText={ handleChange('stock') }
                keyboardType='numeric'
              />
            </Layout>
            {/* SELECTORES */}
            <ButtonGroup
              style={{ margin:2, marginTop: 30, marginHorizontal: 15}}
              size='small'
              appearance='outline'
            >
              {
                sizes.map((size) => (
                  <Button
                    onPress={ () => setFieldValue(
                      'sizes',
                      values.sizes.includes(size)
                        ? values.sizes.filter( s => s !== size )
                        : [...values.sizes, size]
                    )}
                    key={size}
                    style={{ 
                      flex: 1,
                      backgroundColor: values.sizes.includes(size) ?  theme['color-primary-200'] : undefined
                    }}
                  >{size}</Button>
                ))
              }
            </ButtonGroup>

            <ButtonGroup
              style={{ margin:2, marginTop: 30, marginHorizontal: 15}}
              size='small'
              appearance='outline'
            >
              {
                genders.map((gender) => (
                  <Button
                    onPress={ () => setFieldValue('gender', gender) }
                    key={gender}
                    style={{ 
                      flex: 1,
                      backgroundColor: values.gender.startsWith(gender) ?  theme['color-primary-200'] : undefined
                    }}
                  >{gender}</Button>
                ))
              }
            </ButtonGroup>
            {/* GUARDAR */}
            <Button
              accessoryLeft={ <MyIcon name='save-outline' white />}
              onPress={ () => handleSubmit() }
              disabled={ mutation.isPending }
              style={{margin: 15}}
            >
              Guardar
            </Button>

              {/* <Text>{JSON.stringify(values, null, 2)}</Text> */}
              <Layout style= {{ height: 200 }} />
          </ScrollView>
        </MainLayout>
        )
      }


    </Formik>
  )
}
