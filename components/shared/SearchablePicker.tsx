import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { height } = Dimensions.get('window');

interface SearchablePickerProps {
    isVisible: boolean;
    onClose: () => void;
    onSelect: (value: string) => void;
    items: string[];
    selectedValue?: string;
    title: string;
    placeholder?: string;
}

const SearchablePicker: React.FC<SearchablePickerProps> = ({
    isVisible,
    onClose,
    onSelect,
    items,
    selectedValue,
    title,
    placeholder = 'Search...'
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = items.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (value: string) => {
        onSelect(value);
        onClose();
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <StatusBar barStyle="light-content" backgroundColor="#000" />
                <View style={{ 
                    backgroundColor: '#1e1b4b',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    height: height * 0.9,
                    marginTop: 'auto'
                }}>
                    {/* Header */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(255,255,255,0.1)'
                    }}>
                        <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={{ 
                            flex: 1, 
                            fontSize: 18, 
                            fontWeight: 'bold',
                            color: '#fff',
                            marginLeft: 8
                        }}>
                            {title}
                        </Text>
                    </View>

                    {/* Search Input */}
                    <View style={{ 
                        padding: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(255,255,255,0.1)'
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderRadius: 8,
                            paddingHorizontal: 12
                        }}>
                            <Ionicons name="search" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder={placeholder}
                                placeholderTextColor="rgba(255,255,255,0.5)"
                                style={{
                                    flex: 1,
                                    paddingVertical: 12,
                                    paddingHorizontal: 8,
                                    color: '#fff',
                                    fontSize: 16
                                }}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.5)" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Items List */}
                    <ScrollView style={{ flex: 1 }}>
                        {filteredItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleSelect(item)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 16,
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'rgba(255,255,255,0.1)',
                                    backgroundColor: selectedValue === item ? 'rgba(250,204,21,0.2)' : 'transparent'
                                }}
                            >
                                <Text style={{ 
                                    flex: 1,
                                    fontSize: 16,
                                    color: selectedValue === item ? '#facc15' : '#fff'
                                }}>
                                    {item}
                                </Text>
                                {selectedValue === item && (
                                    <Ionicons name="checkmark" size={24} color="#facc15" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

export default SearchablePicker; 