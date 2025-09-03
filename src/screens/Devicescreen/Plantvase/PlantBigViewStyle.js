import { StyleSheet, Dimensions } from 'react-native';

//const screenWidth = Dimensions.get("window").width;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4fdfd",
        padding: 20
    },
    lottie: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: -20,
    },
    slider: {
        width: 300,
        opacity: 1,
        marginTop: 10,
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 16,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        marginVertical: 10,
        justifyContent: 'space-between',
    },
    imageContainer: {
        position: "relative",
        alignItems: "center",
        marginBottom: 20
    },
    image: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 2,
        borderColor: "#009688"
    },
    editIcon: {
        position: "absolute",
        bottom: 10,
        // right: screenWidth / 2 - 90,
        backgroundColor: "#009688",
        borderRadius: 20,
        padding: 6
    },
    infoSection: {
        alignItems: "center",
        marginBottom: 20
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#00796b"
    },
    description: {
        fontSize: 14,
        color: "#555",
        textAlign: "center",
        marginTop: 5
    },
    chartSection: {
        marginBottom: 30
    },
    PompTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 2,
        padding:20,
        color: "#00796b"
    },
     PompValueText: {
        fontSize: 18,
        fontWeight: "bold", 
        alignContent:"center",
        color: "#00796b"
    },
    chart: {
        borderRadius: 12
    },
    waterButton: {
        backgroundColor: "#00796b",
        marginHorizontal: 40,
        borderRadius: 10,
        marginBottom: 30
    },
    leftColumn: {
        flex: 1,
        alignItems: 'flex-start',
        gap: 2,
    },

    middleColumn: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    rightColumn: {
        alignItems: 'center',
        justifyContent: 'center',
    }, 
     grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cell: {
        width: '45%',
        height: 120,
        backgroundColor: '#e0f2f1',
        marginBottom: 12,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    pumpLabel: {
        marginTop: 8,
        fontSize: 14,
        color: '#00796b',
        fontWeight: '600',
    },
});
