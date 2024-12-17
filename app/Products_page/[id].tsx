import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getAllProductService } from "../../services/productService";
import { getAllSideDishService } from "../../services/sideDishService";
import { createNewCart, getAllCart } from "../../services/cartServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

//rating
import { getListRating, createNewRating } from "../../services/ratingServices";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string;
  category: string;
  vendorId: string;
  sideDishId: string[];
}

interface SideDish {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface Rating {
  _id: string;
  rating: number;
  comment: string;
}

const ProductDetailScreen: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectAddProduct, setSelectAddProduct] = useState<Product[]>([]);
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Lấy ID sản phẩm từ URL params
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [sideDishes, setSideDishes] = useState<SideDish[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [rating, setRating] = useState<number>(0); // Đánh giá sao của người dùng
  const [comment, setComment] = useState<string>(''); // Bình luận của người dùng

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://10.0.2.2:8080/api/get-all-product?id=${id}`);
        const data = await response.json();

        if (data.errCode === 0 && data.products.length > 0) {
          setProduct(data.products[0]);

          // Fetch các sản phẩm đi kèm
          const addProductResponse = await getAllProductService("ALL");
          const filteredProducts = addProductResponse.products.filter((product) => product.vendorId === data.products[0].vendorId);
          setSelectAddProduct(filteredProducts.filter((product) => product._id !== id));

          // Fetch các món ăn đi kèm
          const sideDishResponse = await getAllSideDishService("ALL");
          setSideDishes(sideDishResponse.sideDishes.filter((sideDish) => data.products[0].sideDishId.includes(sideDish._id)));

          // Fetch đánh giá
          const ratingsResponse = await getListRating(id);
          setRatings(ratingsResponse.data);
        } else {
          console.error('Sản phẩm không tìm thấy hoặc có lỗi từ API.');
        }
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const handleSelectSideDish = (item: SideDish) => {
    if (selectedItems.includes(item._id)) {
      setSelectedItems(selectedItems.filter((id) => id !== item._id));
    } else {
      setSelectedItems([...selectedItems, item._id]);
    }
  };

  const handleAddToCart = async (product: Product) => {
    const storedUser = await AsyncStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      Toast.show({ type: "error", text1: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng" });
      return;
    }

    const response = await getAllCart();
    const userCarts = response.carts.filter((cart) => cart.idUser === user.id);
    const currentCart = Array.isArray(userCarts) ? userCarts : [];
    const productExists = currentCart.some((item) => item.nameProduct === product.name);

    if (productExists) {
      Toast.show({ type: "info", text1: "Sản phẩm đã có trong giỏ hàng" });
      return;
    }

    try {
      const res = await createNewCart({
        idUser: user.id,
        imageProduct: product.image,
        nameProduct: product.name,
        priceProduct: product.price,
        sideDishId: selectedItems,
        vendorId: product.vendorId,
      });

      if (res.errCode === 0) {
        Toast.show({ type: "success", text1: "Sản phẩm đã có trong giỏ hàng" });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Có lỗi xảy ra" });
    }
  };

  const handleSubmitRating = async () => {
    if (!rating || !comment) {
      Toast.show({ type: "error", text1: "Vui lòng nhập đầy đủ thông tin đánh giá" });
      return;
    }

    try {
      const res = await createNewRating({ productId: id, rating, comment });

      if (res.errCode === 0) {
        Toast.show({ type: "success", text1: "Đánh giá của bạn đã được gửi" });
        setRating(0);
        setComment('');
        const updatedRatings = await getListRating(id);
        setRatings(updatedRatings.data);
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Có lỗi xảy ra khi gửi đánh giá" });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {product && (
        <>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${product.price.toFixed(0)}</Text>
            <Text style={styles.productCategory}>Danh mục: {product.category}</Text>
            <TouchableOpacity style={styles.cartButton} onPress={() => handleAddToCart(product)}>
              <Text style={styles.buttonText}>Thêm sản phẩm vào giỏ hàng</Text>
            </TouchableOpacity>
          </View>

          {/* Hiển thị sản phẩm đi kèm */}
          <Text style={styles.sectionTitle}>Tìm hiểu thêm các món khác</Text>
          <FlatList
            data={selectAddProduct}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.addProductContainer} onPress={() => router.push(`/Products_page/${item._id}`)}>
                <Image source={{ uri: item.image }} style={styles.addProductImage} />
                <Text style={styles.addProductName}>{item.name}</Text>
                <Text style={styles.addProductPrice}>${item.price.toFixed(0)}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Hiển thị món ăn đi kèm */}
          <Text style={styles.sectionTitle}>Các món ăn đi kèm cho {product.name}</Text>
          <FlatList
            data={sideDishes}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectSideDish(item)} style={[styles.sideDishContainer, selectedItems.includes(item._id) && styles.selectedContainer]}>
                <Image source={{ uri: item.image }} style={styles.sideDishImage} />
                <Text style={styles.sideDishName}>{item.name}</Text>
                <Text style={styles.sideDishPrice}>${item.price.toFixed(0)}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Đánh giá */}
			<View style={styles.ratingSection}>
			<Text style={styles.ratingTitle}>Đánh giá</Text>
			{ratings.length > 0 ? (
				<FlatList
				data={ratings}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => (
					<View style={styles.ratingItemContainer}>
					<Text style={styles.ratingUser}>Người dùng: {item.userId}</Text>
					<Text style={styles.ratingText}>Đánh giá: {item.rating}</Text>
					<Text style={styles.ratingComment}>Ý kiến: {item.comment}</Text>
					</View>
				)}
				/>
			) : (
				<Text style={styles.noRatingText}>Không có đánh giá nào.</Text>
			)}
			</View>
        </>
      )}
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#f39c12',
		alignItems: 'center',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f39c12',
	},
	ingredientsTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#34495e',
		marginTop: 20,
		textAlign: 'left',  // Căn lề trái
	},
	ingredientsContainer: {
		marginTop: 10,
		marginBottom: 20,
	},
	ingredientText: {
		fontSize: 16,
		color: '#7f8c8d',
		textAlign: 'left',  // Căn lề trái
	},
	productDescription: {
		fontSize: 16,
		color: '#7f8c8d',
		marginVertical: 10,
		textAlign: 'left',  // Căn lề trái
	},
	addToCartButton: {
		backgroundColor: '#d35400',
		padding: 12,
		borderRadius: 5,
		alignItems: 'center',
		marginVertical: 10,
		width: '100%',  // Đảm bảo nút chiếm hết chiều rộng màn hình
	},
	cartButton: {
		backgroundColor: '#f8c471',
		padding: 10,
		borderRadius: 5,
	},
	backButton: {
		backgroundColor: '#d35400',
		padding: 12,
		borderRadius: 5,
		alignItems: 'center',
		marginVertical: 10,
		width: '100%',
	},
	buttonText: {
		color: '#fff',
		fontWeight: 'bold',
	},
	errorText: {
		fontSize: 18,
		color: '#e74c3c',
		marginBottom: 20,
	},
	scrollViewContent: {
		padding: 16,
		backgroundColor: "#fff",
	},
	productImage: {
		width: "100%",
		height: 250,
		resizeMode: "cover",
		borderRadius: 8,
	},
	productDetails: {
		marginTop: 16,
	},
	productName: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
	},
	productPrice: {
		fontSize: 20,
		color: "#FF5733",
		marginVertical: 8,
	},
	productCategory: {
		fontSize: 16,
		color: "#777",
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginVertical: 16,
		color: "#444",
	},
	addProductContainer: {
		marginRight: 16,
		alignItems: "center",
	},
	addProductImage: {
		width: 100,
		height: 100,
		resizeMode: "cover",
		borderRadius: 8,
	},
	addProductName: {
		marginTop: 8,
		fontSize: 14,
		color: "#555",
		textAlign: "center",
	},
	addProductPrice: {
		fontSize: 14,
		color: "#FF5733",
		textAlign: "center",
	},
	sideDishContainer: {
		margin: 10,
		padding: 10,
		borderRadius: 10,
		backgroundColor: "#e0f7fa",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#00796b",
	},
	selectionIndicator: {
		position: "absolute",
		top: 5,
		right: 5,
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: "#00796b",
		justifyContent: "center",
		alignItems: "center",
	},
	circle: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: "#00796b",
	},
	sideDishImage: {
		width: 50,
		height: 50,
		borderRadius: 5,
	},
	sideDishName: {
		marginTop: 5,
		fontSize: 14,
		fontWeight: "bold",
	},
	sideDishPrice: {
		marginTop: 2,
		fontSize: 12,
		color: "#757575",
	},
	ratingSection: {
		marginTop: 20,
		paddingHorizontal: 15,
	  },
	  ratingTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
		color: '#333',
	  },
	  ratingItemContainer: {
		padding: 10,
		marginBottom: 15,
		backgroundColor: '#f8f8f8',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#e0e0e0',
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 5,
		shadowOffset: { width: 0, height: 2 },
	  },
	  ratingUser: {
		fontSize: 14,
		fontWeight: '600',
		color: '#555',
	  },
	  ratingText: {
		fontSize: 16,
		color: '#ffcc00', // Màu vàng cho phần đánh giá
		marginVertical: 5,
	  },
	  ratingComment: {
		fontSize: 14,
		color: '#777',
	  },
	  noRatingText: {
		fontSize: 16,
		color: '#888',
		textAlign: 'center',
		marginTop: 15,
	  },
});

export default ProductDetailScreen;
