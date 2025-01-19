import React, { useState } from 'react';
import { View } from 'react-native';
import TheCategoryBar from './components/TheCategoryBar';

export default function App() {
  const [categories, setCategories] = useState([
    { name: 'Category 1', url: 'https://placehold.jp/150x150.png' },
    { name: 'Category 2', url: 'https://placehold.jp/150x150.png' },
    { name: 'Category 3', url: 'https://placehold.jp/150x150.png' },
    { name: 'Category 4', url: 'https://placehold.jp/150x150.png' },
    { name: 'Category 5', url: 'https://placehold.jp/150x150.png' },
    { name: 'Category 6', url: 'https://placehold.jp/150x150.png' },
    { name: 'Category 7', url: 'https://placehold.jp/150x150.png' },
  ]);

  return (
    <View style={{ flex: 1, margin: 50 }}>
      <TheCategoryBar categories={categories} setCategories={setCategories} />
    </View>
  );
}
