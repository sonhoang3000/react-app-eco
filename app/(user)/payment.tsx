import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createNewOrder } from '../../services/orderService';
import { getAllSideDishService } from '../../services/sideDishService';
import axios from "axios";
import { Linking } from "react-native";

const Payment = () => {
      const router = useRouter();
      const { selectedItems } = useLocalSearchParams();
      const [address, setAddress] = useState('');
      const [paymentMethod, setPaymentMethod] = useState('');
      const [selectItemDishes, setSelectItemDishes] = useState([]);
      const [total, setTotal] = useState(0);
      let parsedItems = typeof selectedItems === 'string' ? JSON.parse(selectedItems) : selectedItems || [];
      const allSideDishIds = parsedItems.map((item) => item.sideDishId).flat();

      useEffect(() => {
            const fetchProduct = async () => {
                  try {
                        const response = await getAllSideDishService('ALL');
                        const matchingSideDishes = response.sideDishes
                              .filter((dish) => allSideDishIds.includes(dish._id))
                              .map((dish) => ({
                                    name: dish.name,
                                    price: dish.price,
                              }));
                        setSelectItemDishes(matchingSideDishes);

                        const totalProductPrice = parsedItems.reduce((sum, item) => sum + item.priceProduct, 0);
                        const totalSideDishPrice = matchingSideDishes.reduce((sum, dish) => sum + dish.price, 0);

                        setTotal(totalProductPrice + totalSideDishPrice);
                  } catch (error) {
                        console.error('Error fetching products:', error);
                  }
            };
            fetchProduct();
      }, []);

      const handleSubmit = async () => {
            if (!address.trim()) {
                  Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ giao hàng!');
                  return;
            }

            if (!paymentMethod) {
                  Alert.alert('Lỗi', 'Vui lòng chọn phương thức thanh toán!');
                  return;
            }

            const orderDetails = {
                  products: parsedItems.map((item) => item.nameProduct),
                  side_dishes: selectItemDishes.map((dish) => dish.name),
                  userId: parsedItems[0]?.idUser,
                  method: paymentMethod === 'cod' ? 'Cash' : 'Vnpay',
                  address,
                  vendorId: parsedItems[0]?.vendorId,
                  total,
            };

            try {
                  if (paymentMethod === 'cod') {
                        await createNewOrder(orderDetails);
                        Alert.alert('Thành công', `Đơn hàng đã được tạo thành công bằng phương thức ${paymentMethod === 'cod' ? 'COD' : 'VnPay'}.`);
                        router.push('/home');
                  } else {
                        const newPayment = {
                              amount: total, // Tính tổng tiền
                              bankCode: null,
                              language: "vn",
                        };

                        const response = await axios.post(
                              "http://10.0.2.2:8080/api/v1/vnpay/create_payment_url",
                              newPayment
                        );

                        console.log('check response', response)

                        if (response.status === 200 && response.data) {
                              await createNewOrder({
                                    products: parsedItems.map((item) => item.nameProduct),
                                    side_dishes: selectItemDishes.map((dish) => dish.name),
                                    userId: parsedItems[0]?.idUser,
                                    method: 'Vnpay',
                                    address,
                                    vendorId: parsedItems[0]?.vendorId,
                                    total,
                              });
                              await Linking.openURL(response.data)
                        }
                        Alert.alert('Thành công', `Đơn hàng đã được tạo thành công bằng phương thức ${paymentMethod === 'cod' ? 'COD' : 'VnPay'}.`);
                        router.push('/home');
                  }


            } catch (error) {
                  console.error('Error creating order:', error);
            }
      };

      return (
            <View style={styles.container}>
                  <Text style={styles.title}>Thanh toán</Text>

                  {/* Danh sách sản phẩm */}
                  <FlatList
                        data={parsedItems}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                              <View style={styles.itemContainer}>
                                    <Image source={{ uri: item.imageProduct }} style={styles.image} />
                                    <View>
                                          <Text style={styles.itemName}>{item.nameProduct}</Text>
                                          <Text>{item.priceProduct} VND</Text>
                                    </View>
                              </View>
                        )}
                  />

                  {/* Món ăn thêm */}
                  {selectItemDishes.length > 0 && (
                        <View>
                              <Text style={styles.subTitle}>Món ăn thêm:</Text>
                              <FlatList
                                    data={selectItemDishes}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                          <View style={styles.itemContainer}>
                                                <Text style={styles.itemName}>{item.name}: </Text>
                                                <Text>{item.price} VND</Text>
                                          </View>
                                    )}
                              />
                        </View>
                  )}

                  {/* Tổng tiền */}
                  <Text style={styles.total}>Tổng tiền: {total} VND</Text>

                  {/* Nhập địa chỉ */}
                  <TextInput
                        style={styles.input}
                        placeholder="Nhập địa chỉ của bạn"
                        value={address}
                        onChangeText={setAddress}
                  />

                  {/* Chọn phương thức thanh toán */}
                  <Text style={styles.subTitle}>Phương thức thanh toán:</Text>
                  <Picker
                        selectedValue={paymentMethod}
                        onValueChange={(itemValue) => setPaymentMethod(itemValue)}
                        style={styles.picker}
                  >
                        <Picker.Item label="Chọn phương thức thanh toán" value="" />
                        <Picker.Item label="Thanh toán khi nhận hàng (COD)" value="cod" />
                        <Picker.Item label="Ví VnPay" value="vn-pay" />
                  </Picker>

                  {/* Nút thanh toán */}
                  <Button title="Xác nhận thanh toán" onPress={handleSubmit} />
            </View>
      );
};

const styles = StyleSheet.create({
      container: { padding: 20, flex: 1 },
      title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
      subTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
      itemContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
      image: { width: 60, height: 60, marginRight: 10, borderRadius: 5 },
      itemName: { fontWeight: 'bold' },
      total: { fontSize: 18, fontWeight: 'bold', marginVertical: 20 },
      input: { borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 },
      picker: { height: 50, borderWidth: 1, borderRadius: 5, marginBottom: 20 },
});

export default Payment;
