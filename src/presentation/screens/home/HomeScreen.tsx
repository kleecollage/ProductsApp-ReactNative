import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FAB } from "../../components/ui/FAB";
import { FullScreenLoader } from "../../components/ui/FullScreenLoader";
import { getProductsByPage } from "../../../actions/products/get-products-by-page";
import { MainLayout } from "../../layouts/MainLayout";
import { ProductList } from "../../components/products/ProductList";
import { RootStackParams } from "../../navigation/StackNavigator";
import { useAuthStore } from "../../store/auth/useAuthStore"

export const HomeScreen = () => {
  // TANSTACK QUERY TRADICIONAL
  // const { isLoading, data: products = [] } = useQuery({
  //   queryKey: ['products', 'infinite'],
  //   staleTime: 1000 * 60 * 60, // 1 hour
  //   queryFn: () => getProductsByPage(0),
  // })  

  const {logout} = useAuthStore();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  
  const { isLoading, data, fetchNextPage} = useInfiniteQuery({
    queryKey: ['products', 'infinite'],
    staleTime: 1000 * 60 * 60, // 1 hour
    initialPageParam: 0,
    queryFn: async(params) => await getProductsByPage(params.pageParam),
    getNextPageParam: (lastPage, allPages) => allPages.length,
  })
  
  
  return (
    <>
      <MainLayout
        title="TesloShop - Products"
        subtitle="Aplicacion Administrativa"
      >
        {
          isLoading
            ? ( <FullScreenLoader /> )
            : ( 
            <ProductList
              products={ data?.pages.flat() ?? [] } 
              fetchNextPage={fetchNextPage}
            /> )
        }
      </MainLayout>
      <FAB
      iconName="plus-outline"
      onPress={ () => navigation.navigate('ProductScreen', {productId: 'new'}) }
      style={{
        position:'absolute',
        bottom: 30,
        right: 20,
      }}
      />
    </>
  )
}