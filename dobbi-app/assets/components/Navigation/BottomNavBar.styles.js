import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#FFE5E5",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 12,
    color: "#FFB3B3",
  },
  activeNavText: {
    color: "#EE6567",
    fontWeight: "500",
  },
  safeArea: {
    backgroundColor: "#FFFFFF",
    marginBottom: -10,
  },
});
