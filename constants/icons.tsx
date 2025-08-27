import { MaterialIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";



export const ICONS = () => {
    const device = <MaterialIcons name="devices-other" size={24} color="black" />;
    const food = <Ionicons name="fast-food" size={24} color="black" />;
    const shopping = <Entypo name="shopping-bag" size={24} color="black" />;
    const medicine = <Fontisto name="pills" size={24} color="black" />;
    const haircut = <Ionicons name="cut" size={24} color="black" />;
    const family = <MaterialIcons name="family-restroom" size={24} color="black" />;
    const income = <Fontisto name="money-symbol" size={24} color="black" />;
    return { device, food, shopping, medicine, haircut, family, income };
};