import { View, Text, Image } from 'react-native'
import React from 'react'
import images from '@/constants/images'

const GroupItem = ({
    title = "CNPM",
    members = 3,
    imageSrc = images.avatar
}:{
    title: string;
    members: number;
    imageSrc: any;
}) => {
  return (
    <View className="border border-1 border-gray-300 p-3 flex flex-row gap-4 rounded-xl">
        <Image
                    source={imageSrc}
                    style={{ width: 70, height: 70, borderRadius: 60 }}
                    />
        <View className="my-auto flex flex-col gap-1">
            <Text className="text-blue-700 text-xl font-semibold">{title}</Text>
            <Text className="text-lg">{members} members</Text>
        </View>
    </View>
  )
}

export default GroupItem