import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  ScrollView,
  View,
  Text,
  Image,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { FlatGrid, SectionGrid } from 'react-native-super-grid';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from '@react-native-community/async-storage';
let { width, height } = Dimensions.get('window');

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
      isLoading: true,
      mechanics: []
    }
  }

  static navigationOptions = {
      title: 'Home',
      headerStyle: { backgroundColor: 'rgba(255,255,255,1)' },
      headerTitleStyle: { color: '#000' },
  }

  async componentDidMount() {
    await this.getCards();
    //console.log(Object.keys(this.state.cards));
    await this.setState({isLoading: false});
  }

  async getCards() {
    let query = "https://omgvamp-hearthstone-v1.p.rapidapi.com/cards";
    let pCards = {};
    let pMechanics = [];
    const regex = /(<([^>]+)>)/ig;

    await fetch(query,{
      method: 'Get',
      headers: {
        "x-rapidapi-key": "13ed3f8bd9msh9de1ca3ea5c6ee5p13732fjsn6fd5eb1f0624",
        "x-rapidapi-host": "omgvamp-hearthstone-v1.p.rapidapi.com",
        "useQueryString": true
      }
    }).then((response) => response.json()).then((res)=>{

      
      for(var key in res){
        //console.log("Key: "+key+" length: "+res[key].length)
        for(let newCard of res[key]){
          if(newCard.hasOwnProperty("mechanics")){

            //if(newCard.hasOwnProperty("img")){}

            if(newCard.hasOwnProperty("text")){
              newCard.text = newCard.text.replace(regex, '');
            }

            for(let newMec of newCard["mechanics"]){

              if(!pCards.hasOwnProperty(newMec["name"])){
                pCards[newMec["name"]] = [];
              }

              pCards[newMec["name"]].push(newCard)

            }
          }
        }
      }


      //AsyncStorage.setItem("keys", JSON.stringify(Object.keys(pCards)))
      

      for(var key in pCards){
        const uniqC = Array.from(new Set(pCards[key]));
        AsyncStorage.setItem(key, JSON.stringify(uniqC))
      }

      //total : 10696
      //console.log("Total length: "+pCards["Battlecry"].length)
      //console.log(Object.keys(pCards))

      try {
        this.setState({
          cards: pCards,
          mechanics: Object.keys(pCards).sort(),
          isLoading: false
        })
      } catch (e) {
          console.log(e);
      }
    })
  }

  selectType(item){
    this.props.navigation.navigate("CardMec", {'cardType':String(item)})
  }

  renderButton(item,index){
    return(
      <TouchableOpacity
        onPress={() => this.selectType(item)}
        style={styles.cardButton}
      >
        <ImageBackground source={require("../resources/image/button.png")} style={styles.buttonImage}>
          <Text 
          numberOfLines={ 1 }
          adjustsFontSizeToFit
          style={styles.buttonText}
          >{item}
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    )
  }

  render(){

    const { navigate } = this.props.navigation;
    
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <Image style= { styles.backgroundImage } source={require("../resources/image/bg.jpg")} />
          <ActivityIndicator size="large" color="#0055ff" />
        </View>
      )
    }
    return (
      <>
        <Image style= { styles.backgroundImage } source={require("../resources/image/bg.jpg")} />

        <TouchableOpacity
        onPress={() => navigate("SearchCard")}
        style={styles.searchButton}
        >
          <ImageBackground source={require("../resources/image/button.png")} style={styles.buttonImage}>
            <Text 
            numberOfLines={ 1 }
            adjustsFontSizeToFit
            style={styles.searchButtonText}
            >Search
            </Text>
          </ImageBackground>
        </TouchableOpacity>

        <FlatGrid
          itemDimension={width/3}
          data={this.state.mechanics}
          style={styles.gridView}
          // staticDimension={300}
          // fixed
          spacing={10}
          renderItem={({item,index}) => this.renderButton(item,index)}
        />
      </>
    );
  }
}


const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  cardContainer:{},
  card:{},
  cardButton:{
    height: height/8,
    backgroundColor: "rgba(255,255,255,0)",//#0c5692
    opacity: 1,
    borderRadius: 15,
    justifyContent: "center"
  },
  searchButton:{
    height: height/6,
    width: "70%",
    left: "15%",
    backgroundColor: "rgba(255,50,12,0)",
    opacity: 1,
    borderRadius: 15,
    justifyContent: "center",
    marginTop: "5%"
  },
  searchButtonText: {
    fontSize: RFValue(height/25, height),
    fontWeight: 'bold',
    color: "rgba(0,0,0,1)",
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: "10%"
  },
  buttonText: {
    fontSize: RFValue(15, height),
    fontWeight: 'bold',
    color: "rgba(0,0,0,1)",
    textAlign: "center",
    alignSelf: "center",
    marginBottom: "10%"
  },
  buttonImage:{
    width: "100%",
    height: "80%",
    flex: 1,
    //resizeMode: "cover",
    //...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignSelf: "center",
  },
  backgroundImage:{
    flex: 1,
    position: 'absolute',
    resizeMode: "stretch",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0.6,
    width: width,
    height: height,
  },
})