import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const TheCategoryBar = ({ categories, setCategories }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showAddButton, setShowAddButton] = useState(false);
  const [longPressCategory, setLongPressCategory] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const scrollViewRef = useRef(null);

  const handleSingleTap = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleLongPressStart = (category) => {
    const deleteTimer = setTimeout(() => {
      setLongPressCategory(true); // Show the cross icon after 2 seconds
    }, 200);

    const replaceTimer = setTimeout(() => {
      openImagePicker(category); // Open image picker after 3 seconds
    }, 3000);

    setLongPressTimer({ deleteTimer, replaceTimer });
  };

const handleLongPressEnd = () => {
  clearTimeout(longPressTimer?.deleteTimer);
  clearTimeout(longPressTimer?.replaceTimer);
  // setLongPressCategory(null); // Hide the cross icon if released early
};

  const confirmDeleteCategory = (category) => {
    Alert.alert(
      "Подтверждение",
      `Вы действительно хотите удалить категорию '"${category.name}"' ?`,
      [
        { text: "Отмена", style: "cancel" },
        { text: "Удалить", onPress: () => deleteCategory(category) }
      ]
    );
  };

  const deleteCategory = (category) => {
    setCategories(categories.filter(cat => cat !== category)); // Delete category
    setLongPressCategory(false); // Hide the cross icon
  };

  const openImagePicker = async (category) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      const updatedCategories = categories.map(cat =>
        cat === category ? { ...cat, url: result.uri } : cat
      );
      setCategories(updatedCategories);
    }
  };

  const handleScroll = (event) => {
    const contentWidth = event.nativeEvent.contentSize.width;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const visibleWidth = event.nativeEvent.layoutMeasurement.width;

    setShowAddButton(contentOffsetX + visibleWidth >= contentWidth - 10);
  };

  const addCategory = () => {
    const newCategory = {
      name: `New Category ${categories.length + 1}`,
      url: 'https://via.placeholder.com/50',
    };
    setCategories([...categories, newCategory]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        ref={scrollViewRef}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        {categories.map((category, index) => (
          <View key={index} style={{ position: 'relative' }}>
            <TouchableOpacity
              onPress={() => handleSingleTap(category)}
              onLongPress={() => handleLongPressStart(category)}
              onPressOut={handleLongPressEnd}
              style={[
                styles.category,
                selectedCategories.includes(category) && styles.selectedCategory,
              ]}
            >
              <Image source={{ uri: category.url }} style={styles.image} />
              <Text style={styles.text}>{category.name}</Text>
            </TouchableOpacity>

            {longPressCategory && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDeleteCategory(category)} // Confirm before deleting
              >
                <Text style={styles.deleteButtonText}>x</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {showAddButton && (
          <TouchableOpacity onPress={addCategory} style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '25%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  scrollViewContainer: {
    flexDirection: 'row',
  },
  category: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    margin: 20
  },
  selectedCategory: {
    backgroundColor: '#f0f0f0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Box shadow for selected category
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  text: {
    textAlign: 'center',
  },
  addButton: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 40,
    color: '#333',
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#f6f6f6',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  deleteButtonText: {
    color: '#858585',
    fontSize: 18,
  },
});

export default TheCategoryBar;
