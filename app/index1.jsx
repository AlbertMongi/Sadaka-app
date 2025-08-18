import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // For navigation

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const nav = useNavigation(); // Use navigation hook
  const [activeTab, setActiveTab] = useState("Home");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const wordOfDay = [
    {
      verse:
        "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
      ref: "Joshua 1:9",
      img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    },
    {
      verse: "The Lord is my shepherd; I shall not want.",
      ref: "Psalm 23:1",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    },
    {
      verse: "I can do all this through him who gives me strength.",
      ref: "Philippians 4:13",
      img: "https://images.unsplash.com/photo-1496449903678-68ddcb189a24",
    },
  ];

  const sermons = [
    { title: "Lent", img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429" },
    { title: "Salvation", img: "https://images.unsplash.com/photo-1500534623283-312aade485b7" },
    { title: "Gratitude", img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" },
  ];

  const speakers = [
    { name: "Pastor Tony", img: "https://i.pravatar.cc/100?img=1" },
    { name: "Kuhani Musa", img: "https://i.pravatar.cc/100?img=2" },
    { name: "Rose Shaboka", img: "https://i.pravatar.cc/100?img=3" },
    { name: "Nick Shaboka", img: "https://i.pravatar.cc/100?img=4" },
  ];

  const handleTabPress = (tab, screen) => {
    setActiveTab(tab);
    nav.navigate(screen);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAF5EF" }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#333333" }}>
          {getGreeting()} Albert
        </Text>
        <Text style={{ fontSize: 16, color: "#555555", marginTop: 4 }}>
          Welcome back, be inspired today!
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 25 }}>
          <Text style={styles.sectionTitle}>Word of the Day</Text>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, marginTop: 12 }}
          >
            {wordOfDay.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.wordCard}
                onPress={() =>
                  navigation.navigate("WordDetail", {
                    verse: item.verse,
                    ref: item.ref,
                  })
                }
              >
                <Image
                  source={{ uri: item.img }}
                  style={{ width: "100%", height: 160 }}
                  resizeMode="cover"
                />
                <View style={styles.wordOverlay}>
                  <Text style={styles.verse}>{item.verse}</Text>
                  <Text style={styles.ref}>{item.ref}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ marginBottom: 25 }}>
          <Text style={styles.sectionTitle}>Sermons</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, marginTop: 12 }}
          >
            {sermons.map((sermon, i) => (
              <TouchableOpacity
                key={i}
                style={styles.sermonCard}
                onPress={() =>
                  navigation.navigate("SermonDetail", { title: sermon.title })
                }
              >
                <Image
                  source={{ uri: sermon.img }}
                  style={{ width: "100%", height: "100%", position: "absolute" }}
                />
                <View style={styles.sermonOverlay}>
                  <Text style={styles.sermonTitle}>{sermon.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ marginBottom: 100 }}>
          <Text style={styles.sectionTitle}>Upcoming events</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, marginTop: 12 }}
          >
            {speakers.map((speaker, i) => (
              <TouchableOpacity
                key={i}
                style={{ alignItems: "center", marginRight: 20 }}
                onPress={() =>
                  navigation.navigate("SpeakerDetail", { name: speaker.name })
                }
              >
                <Image
                  source={{ uri: speaker.img }}
                  style={{ width: 70, height: 70, borderRadius: 35, marginBottom: 6 }}
                />
                <Text style={{ fontSize: 12, fontWeight: "500", color: "#444444" }}>
                  {speaker.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabPress("Home", "Home")}
        >
          <Ionicons
            name="home"
            size={16}
            color={activeTab === "Home" ? "#6B4F4F" : "#A89F9F"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabPress("Bible", "Bible")}
        >
          <MaterialCommunityIcons
            name="book-open-page-variant"
            size={16}
            color={activeTab === "Bible" ? "#6B4F4F" : "#A89F9F"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.centerButtonWrapper}
          onPress={() => handleTabPress("Chat", "Chat")}
        >
          <View style={styles.centerButton}>
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color="#FFFFFF"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabPress("Notifications", "Notifications")}
        >
          <Ionicons
            name="notifications-outline"
            size={16}
            color={activeTab === "Notifications" ? "#6B4F4F" : "#A89F9F"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabPress("Profile", "Profile")}
        >
          <Ionicons
            name="person"
            size={16}
            color={activeTab === "Profile" ? "#6B4F4F" : "#A89F9F"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
    paddingHorizontal: 20,
  },
  wordCard: {
    width: width * 0.8,
    marginRight: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  wordOverlay: {
    padding: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  verse: { color: "#FFFFFF", fontSize: 15, fontWeight: "500", lineHeight: 20 },
  ref: { color: "#FFFFFF", fontWeight: "bold", marginTop: 5, fontSize: 12 },
  sermonCard: {
    width: 100,
    height: 65,
    borderRadius: 12,
    marginRight: 15,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  sermonOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  sermonTitle: { color: "#FFFFFF", fontSize: 12, fontWeight: "600", textAlign: "center" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F0E8E0",
    height: 50,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 5,
    elevation: 5,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  centerButtonWrapper: {
    top: -15,
    position: "relative",
  },
  centerButton: {
    backgroundColor: "#F4A261",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});