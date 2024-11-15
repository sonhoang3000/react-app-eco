import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface NavbarProps {
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  return (
    <View style={{ backgroundColor: '#f8c471', padding: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{title}</Text>
      <TouchableOpacity>
        <Text style={{ color: 'white' }}>🔔</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;
